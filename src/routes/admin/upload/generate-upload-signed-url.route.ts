import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeGenerateSignedUrlForUploadService } from "@/factories/services/upload/make-generate-signed-url-for-upload-service.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import {
	apiDefaultErrorResponseSchema,
	apiSuccessResponseSchema,
	apiValidationErrorResponseSchema
} from "@/schemas/api-schema.js";
import { signedUrlResponseSchema } from "@/schemas/response-schema.js";
import { uploadSignedUrlBodySchema } from "@/schemas/upload-schema.js";

export const generateUploadSignedUrlRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/",
		{
			schema: {
				operationId: "generateUploadSignedUrl",
				tags: ["Uploads"],
				summary: "Gerar URL pré-assinada para upload de arquivo",
				body: uploadSignedUrlBodySchema,
				response: {
					200: apiSuccessResponseSchema(signedUrlResponseSchema),
					401: apiDefaultErrorResponseSchema,
					403: apiDefaultErrorResponseSchema,
					422: apiValidationErrorResponseSchema,
					500: apiDefaultErrorResponseSchema
				}
			},
			onRequest: [
				isAuthenticated,
				ensureUserHasPermission([
					PermissionType.MANAGE_ESTABLISHMENTS,
					PermissionType.MANAGE_BANNERS,
					PermissionType.MANAGE_PRODUCTS
				])
			]
		},
		async (request, reply) => {
			const body = request.body;

			const uploadSignedUrlService = makeGenerateSignedUrlForUploadService();

			const upload = await uploadSignedUrlService.handle(body);

			return reply
				.status(HTTPStatusCodes.OK)
				.send(ApiResponse.success("URL gerada com sucesso", upload));
		}
	);
};
