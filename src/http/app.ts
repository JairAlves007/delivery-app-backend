import { env } from "@/env";
import { ApiResponse } from "@/helpers/api";
import { HTTPStatusCodes } from "@/helpers/http-request-codes";
import { routes } from "@/routes";
import fastifyCors from "@fastify/cors";
import fastify from "fastify";
import replySendErrorPlugin from "@/plugins/reply-send-error";
import { flattenError, ZodError } from "zod";

const app = fastify();

app.register(fastifyCors, {
	origin: env.CORS_ORIGIN
});

app.register(replySendErrorPlugin);
app.register(routes);

app.decorateRequest("role", null);
app.decorateRequest("user", null);

app.setErrorHandler((error, _request, reply) => {
	if (env.NODE_ENV !== "production") console.error(error);

	return reply.sendError(error);
});

export { app };
