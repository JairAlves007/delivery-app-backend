import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeDeleteAddressService } from "@/factories/services/address/make-delete-address-service.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { customerTags } from "@/http/swagger-tags.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import { addressParamsSchema } from "@/schemas/address-schema.js";
import {
	apiDefaultErrorResponseSchema,
	apiSuccessResponseSchema,
	apiValidationErrorResponseSchema
} from "@/schemas/api-schema.js";
import { userIdSchema } from "@/schemas/generic-schema.js";

export const deleteAddressRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().delete(
		"/:id",
		{
			schema: {
				operationId: "deleteAddress",
				tags: customerTags("Addresses"),
				summary: "Deletar um endereço",
				params: addressParamsSchema,
				response: {
					204: apiSuccessResponseSchema(z.object({})),
					401: apiDefaultErrorResponseSchema,
					403: apiDefaultErrorResponseSchema,
					404: apiDefaultErrorResponseSchema,
					422: apiValidationErrorResponseSchema,
					500: apiDefaultErrorResponseSchema
				}
			},
			onRequest: [
				isAuthenticated,
				ensureUserHasPermission([PermissionType.MANAGE_OWN_ADDRESSES])
			]
		},
		async (request, reply) => {
			const { id } = request.params;
			const userId = userIdSchema.parse(request.user.sub);

			const deleteAddressService = makeDeleteAddressService();

			await deleteAddressService.handle({
				id,
				filterParams: { user_id: userId },
				paramsToForget: { user_id: userId }
			});

			return reply
				.status(HTTPStatusCodes.NO_CONTENT)
				.send(ApiResponse.success("Endereço deletado com sucesso", {}));
		}
	);
};
