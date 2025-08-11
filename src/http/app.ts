import { env } from "@/env";
import { routes } from "@/routes";
import fastifyCors from "@fastify/cors";
import fastify from "fastify";
import replySendErrorPlugin from "@/plugins/reply-send-error";
import fastifyJwt from "@fastify/jwt";

const app = fastify();

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

export { app };
