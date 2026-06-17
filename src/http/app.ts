import { randomUUID } from "node:crypto";

import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyJwt from "@fastify/jwt";
import fastifyRateLimit from "@fastify/rate-limit";
import fastifySwagger from "@fastify/swagger";
import scalarApiReference from "@scalar/fastify-api-reference";
import fastify from "fastify";
import {
	createJsonSchemaTransform,
	createJsonSchemaTransformObject,
	serializerCompiler,
	validatorCompiler
} from "fastify-type-provider-zod";

import { BaseQueue } from "@/classes/queue.js";
import { env } from "@/env.js";
import Constants from "@/helpers/constants.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { redis } from "@/lib/redis.js";
import replySendErrorPlugin from "@/plugins/reply-send-error.js";
import { routes } from "@/routes/index.js";
import type { DefaultErrorResponse } from "@/types/response.js";
import { setupWorkers } from "@/workers/setup.js";

const isProduction = env.NODE_ENV === "production";

const app = fastify({
	logger: {
		transport: {
			target: "pino-pretty",
			options: {
				translateTime: "HH:MM:ss Z",
				ignore: "pid,hostname"
			}
		}
	},
	genReqId: () => randomUUID()
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: "Food Delivery API",
			description: "Documentação da API de um SaaS de Delivery",
			version: "1.0.0"
		},
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT"
				}
			}
		}
	},
	transform: createJsonSchemaTransform({
		zodToJsonConfig: {
			target: "openapi-3.0"
		}
	}),
	transformObject: createJsonSchemaTransformObject({
		zodToJsonConfig: {
			target: "openapi-3.0"
		}
	})
});

app.register(scalarApiReference, {
	routePrefix: "/docs",
	configuration: {
		title: "Food Delivery API",
		theme: "deepSpace",
		sources: [
			{
				url: "/api/swagger.json",
				title: "Documentação da API de um SaaS de Delivery",
				slug: "documentacao-da-api-de-um-saas-de-delivery"
			}
		]
	}
});

app.register(fastifyHelmet, {
	global: true,
	contentSecurityPolicy: isProduction
		? {
				directives: {
					defaultSrc: ["'self'"],
					scriptSrc: ["'self'"],
					styleSrc: ["'self'", "'unsafe-inline'"],
					imgSrc: ["'self'", "data:", "blob:"],
					connectSrc: ["'self'"],
					fontSrc: ["'self'"],
					objectSrc: ["'none'"],
					frameAncestors: ["'none'"]
				}
			}
		: false,
	crossOriginEmbedderPolicy: isProduction,
	crossOriginOpenerPolicy: isProduction,
	crossOriginResourcePolicy: isProduction ? { policy: "same-origin" } : false,
	hsts: isProduction ? { maxAge: 31536000, includeSubDomains: true } : false,
	referrerPolicy: { policy: "strict-origin-when-cross-origin" },
	xFrameOptions: { action: "deny" }
});

app.register(fastifyCors, {
	origin: isProduction
		? env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
		: true,
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
	allowedHeaders: [
		"Content-Type",
		"Authorization",
		Constants.PUBLIC_API_KEY_HEADER
	],
	credentials: false,
	maxAge: 86400
});

app.register(fastifyRateLimit, {
	global: true,
	max: isProduction ? 120 : 1000,
	timeWindow: "1 minute",
	redis,
	keyGenerator: request => {
		const userId = request.user?.sub;
		const ip = request.ip;
		return userId ? `${ip}:${userId}` : ip;
	},
	errorResponseBuilder: (_request, context) => ({
		success: false,
		code: "RATE_LIMIT_ERROR",
		details: {
			error: {
				message: `Limite de requisições excedido. Tente novamente em ${Math.ceil(context.ttl / 1000)} segundos.`
			}
		}
	})
});

app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
	sign: {
		iss: "delivery-api",
		aud: "delivery-client"
	},
	verify: {
		allowedIss: "delivery-api",
		allowedAud: "delivery-client"
	}
});

app.register(replySendErrorPlugin);
app.register(routes);

app.addHook("onReady", async () => {
	try {
		await setupWorkers();
		app.log.info("👷 BullMQ Workers initialized successfully");
	} catch (error) {
		app.log.error({ error }, "❌ Failed to initialize BullMQ Workers");
	}
});

app.addHook("onClose", async () => {
	try {
		await BaseQueue.closeAll();
		app.log.info("👷 BullMQ Workers closed gracefully");
	} catch (error) {
		app.log.error({ error }, "❌ Failed to close BullMQ Workers");
	}
});

app.setErrorHandler((error, _request, reply) => {
	if (!isProduction) app.log.error(error);

	return reply.sendError(error);
});

app.setNotFoundHandler((request, reply) => {
	const errorResponse: DefaultErrorResponse = {
		success: false,
		code: "ROUTE_NOT_FOUND_ERROR",
		details: {
			error: {
				message: `A rota ${request.url} com o protocolo ${request.method} não foi encontrada`
			}
		}
	};

	return reply.status(HTTPStatusCodes.NOT_FOUND).send(errorResponse);
});

export { app };
