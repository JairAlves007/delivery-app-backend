import { FastifyInstance } from "fastify";

export const healthRoutes = async (server: FastifyInstance) => {
	server.get("/ping", async () => {
		return { status: "ok" };
	});
};
