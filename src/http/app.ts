import { env } from "@/env";
import { routes } from "@/routes";
import fastifyCors from "@fastify/cors";
import fastify from "fastify";

const app = fastify();

app.register(fastifyCors, {
	origin: env.CORS_ORIGIN
});

app.register(routes);

export { app };
