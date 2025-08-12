import type { FastifyInstance } from "fastify/types/instance";

export const healthRoutes = async (app: FastifyInstance) => {
	app.get("/ping", async () => {
		return { status: "ok" };
	});
};
