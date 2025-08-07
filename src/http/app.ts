import { env } from "@/env";
import { ApiResponse } from "@/helpers/api";
import { HTTPStatusCodes } from "@/helpers/http-request-codes";
import { routes } from "@/routes";
import fastifyCors from "@fastify/cors";
import fastify from "fastify";
import { flattenError, ZodError } from "zod";

const app = fastify();

app.register(fastifyCors, {
	origin: env.CORS_ORIGIN
});

app.register(routes);

app.decorateRequest("role", null);
app.decorateRequest("user", null);

app.setErrorHandler((error, _request, reply) => {
	if (error instanceof ZodError) {
		error.name = "Validation Error";

		return reply
			.status(HTTPStatusCodes.INTERNAL_SERVER_ERROR)
			.send(ApiResponse.error(error, flattenError(error).fieldErrors));
	}

	if (env.NODE_ENV !== "production") console.error(error);

	error.name = "Internal Server Error";

	return reply
		.status(HTTPStatusCodes.INTERNAL_SERVER_ERROR)
		.send(ApiResponse.error(error));
});

export { app };
