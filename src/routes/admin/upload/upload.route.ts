import {
	generateUploadSignedUrl,
	getUploadResourceRules
} from "@/controllers/upload.controller.ts";
import { PermissionType } from "@/generated/prisma/client.ts";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.ts";
import { isAuthenticated } from "@/middlewares/is-auth.ts";
import type { FastifyInstance } from "fastify";

const uploadMiddlewares = {
	onRequest: [
		isAuthenticated,
		ensureUserHasPermission([
			PermissionType.MANAGE_ESTABLISHMENTS,
			PermissionType.MANAGE_BANNERS,
			PermissionType.MANAGE_PRODUCTS
		])
	]
};

export const uploadRoutes = (app: FastifyInstance) => {
	app.post("/", uploadMiddlewares, generateUploadSignedUrl);
	app.get("/rules", uploadMiddlewares, getUploadResourceRules);
};
