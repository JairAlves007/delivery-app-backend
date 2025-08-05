import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { env } from "@/env";
import { routes } from "@/routes";

const app = fastify();

app.register(fastifyCors, {
	origin: env.CORS_ORIGIN
});

app.register(routes);

app
	.listen({
		port: +env.PORT,
		host: "0.0.0.0"
	})
	.then(() => {
		console.log(`🚀 Server is running on ${env.BASE_URL}`);
	})
	.catch(err => {
		console.error("Error starting server:", err);
		process.exit(1);
	});
