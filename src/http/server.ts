import fastify from "fastify";
import { env } from "../env";
import { routes } from "../routes";

const server = fastify();

server.register(routes);

server
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
