import { FastifyInstance } from "fastify/types/instance";
import { generateUploadSignedUrl } from "@/controllers/upload.controller";
import { isAuthenticated } from "@/middlewares/is-auth";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission";
import { PermissionType } from "@prisma/client";

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
};
