import {
	destroy,
	index,
	store,
	update
} from "@/controllers/product.controller.ts";
import type { FastifyInstance } from "fastify";

export const adminProductsRoutes = async (app: FastifyInstance) => {
	app.get("/", index);
	app.post("/", store);
	app.patch("/:id", update);
	app.delete("/:id", destroy);
};
