import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
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
import replySendErrorPlugin from "@/plugins/reply-send-error.js";
import { routes } from "@/routes/index.js";
import type { DefaultErrorResponse } from "@/types/response.js";
import { setupWorkers } from "@/workers/setup.js";

const app = fastify({
	logger: {
		transport: {
			target: "pino-pretty",
			options: {
				translateTime: "HH:MM:ss Z",
				ignore: "pid,hostname"
			}
		}
	}
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

app.register(fastifyCors, {
	origin: env.CORS_ORIGIN
});

app.register(fastifyJwt, {
	secret: env.JWT_SECRET
});

app.register(replySendErrorPlugin);
app.register(routes);

app.addHook("onReady", () => {
	try {
		setupWorkers();
		app.log.info("👷 BullMQ Workers initialized successfully");
	} catch (error) {
		app.log.error({ error }, "❌ Failed to initialize BullMQ Workers");
	}
});

app.setErrorHandler((error, _request, reply) => {
	if (env.NODE_ENV !== "production") app.log.error(error);

	return reply.sendError(error);
});

app.setNotFoundHandler((request, reply) => {
	const errorResponse: DefaultErrorResponse = {
		success: false,
		code: "ROUTE_NOT_FOUND_ERROR",
		details: {
			error: {
				message: `A rota ${request.url} com o protocolo ${request.method} não foi encontrada`
			}
		}
	};

	return reply.status(HTTPStatusCodes.NOT_FOUND).send(errorResponse);
});

export { app };
