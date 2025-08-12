import { env } from "@/env";
import { routes } from "@/routes";
import { HTTPStatusCodes } from "@/helpers/http-request-codes";
import type { DefaultErrorResponse } from "@/types/response";
import fastifyCors from "@fastify/cors";
import fastify from "fastify";
import replySendErrorPlugin from "@/plugins/reply-send-error";
import fastifyJwt from "@fastify/jwt";

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
		message: "ROUTE_NOT_FOUND_ERROR",
		details: {
			error: {
				message: `A rota ${request.url} com o protocolo ${request.method} não foi encontrada`
			}
		}
	};

	return reply.status(HTTPStatusCodes.NOT_FOUND).send(errorResponse);
});

export { app };
