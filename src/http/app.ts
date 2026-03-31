import { randomUUID } from "node:crypto";

import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyJwt from "@fastify/jwt";
import fastifyRateLimit from "@fastify/rate-limit";
import fastifySwagger from "@fastify/swagger";
import scalarApiReference from "@scalar/fastify-api-reference";
import fastify from "fastify";
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider
} from "fastify-type-provider-zod";

import { env } from "@/env.js";
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

// ─── Swagger / Scalar ───────────────────────────────────────────────

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
	transform: jsonSchemaTransform
});

app.register(scalarApiReference, {
	routePrefix: "/docs",
	configuration: {
		title: "Food Delivery API",
		theme: "deepSpace",
		sources: [
			{
				url: "/swagger.json",
				title: "Documentação da API de um SaaS de Delivery",
				slug: "documentacao-da-api-de-um-saas-de-delivery"
			}
		]
	}
});

app.withTypeProvider<ZodTypeProvider>().route({
	method: "GET",
	url: "/swagger.json",
	schema: {
		hide: true
	},
	handler: async () => {
		return app.swagger();
	}
});

// ─── Security: Helmet ───────────────────────────────────────────────
// Security headers via @fastify/helmet. More restrictive in production.

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

// ─── Security: CORS ─────────────────────────────────────────────────
// Em production, ALLOWED_ORIGINS define a whitelist de origens permitidas.
// Em development, permite qualquer origem para facilitar o desenvolvimento.

app.register(fastifyCors, {
	origin: isProduction
		? env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
		: true,
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
	credentials: false,
	maxAge: 86400
});

// ─── Security: CSRF ─────────────────────────────────────────────────
// CSRF protection is NOT needed for this API because:
// - Authentication uses exclusively JWT via "Authorization: Bearer" header
// - No cookies are used for session management
// - CSRF attacks exploit automatic cookie inclusion by browsers,
//   which does not apply to Bearer token authentication

// ─── Security: Rate Limiting ────────────────────────────────────────
// Global rate limit with Redis store for multi-instance support.
// Category-specific limits are applied per-route via `config.rateLimit`.

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

// ─── Auth: JWT ──────────────────────────────────────────────────────

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

// ─── Plugins & Routes ───────────────────────────────────────────────

app.register(replySendErrorPlugin);
app.register(routes);

// ─── Workers ────────────────────────────────────────────────────────

app.addHook("onReady", () => {
	try {
		setupWorkers();
		app.log.info("👷 BullMQ Workers initialized successfully");
	} catch (error) {
		app.log.error({ error }, "❌ Failed to initialize BullMQ Workers");
	}
});

// ─── Error Handling ─────────────────────────────────────────────────

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
