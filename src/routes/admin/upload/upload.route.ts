import type { FastifyInstance } from "fastify";

import {
	generateUploadSignedUrl,
	getUploadResourceRules
} from "@/controllers/upload.controller.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";

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
