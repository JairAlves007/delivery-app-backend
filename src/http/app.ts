import { env } from "@/env";
import { routes } from "@/routes";
import fastifyCors from "@fastify/cors";
import fastify from "fastify";
import { flattenError, ZodError } from "zod";

const app = fastify();

app.register(fastifyCors, {
	origin: env.CORS_ORIGIN
});

app.register(routes);

app.setErrorHandler((error, _request, reply) => {
	if (error instanceof ZodError) {
		return reply.status(400).send({
			success: false,
			message: "Validation Error",
			details: flattenError(error).fieldErrors
		});
	}

	if (env.NODE_ENV !== "production") console.error(error);

	return reply.status(500).send({
		success: false,
		message: "Internal Server Error",
		details: {
			error: {
				code: error.code,
				message: error.message
			}
		}
	});
});

export { app };
