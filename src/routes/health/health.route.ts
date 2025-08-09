import type { FastifyInstance } from "fastify";

export const healthRoutes = async (app: FastifyInstance) => {
	app.get("/ping", async () => {
		return { status: "ok" };
	});
};
