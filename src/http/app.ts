import "@/@types/zod.d.ts";
import "@/listeners/index.ts";

import { env } from "@/env.ts";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.ts";
import replySendErrorPlugin from "@/plugins/reply-send-error.ts";
import { routes } from "@/routes/index.ts";
import type { DefaultErrorResponse } from "@/types/response.ts";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import fastify from "fastify";

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

app.register(fastifyCors, {
	origin: env.CORS_ORIGIN
});

app.register(fastifyJwt, {
	secret: env.JWT_SECRET
});

app.register(replySendErrorPlugin);
app.register(routes);

app.setErrorHandler((error, _request, reply) => {
	if (env.NODE_ENV !== "production") console.error(error);

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
