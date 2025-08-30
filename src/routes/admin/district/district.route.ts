import {
	destroy,
	index,
	store,
	update
} from "@/controllers/district.controller.ts";
import type { FastifyInstance } from "fastify";

export const adminDistrictRoutes = async (app: FastifyInstance) => {
	app.get("/", index);
	app.post("/", store);
	app.patch("/:id", update);
	app.delete("/:id", destroy);
};
