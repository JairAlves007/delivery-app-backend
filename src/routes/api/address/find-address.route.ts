import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeFindAddressService } from "@/factories/services/address/make-find-address-service.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { ensureIsResourceOwner } from "@/middlewares/ensure-is-resource-owner.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import { addressParamsSchema } from "@/schemas/address-schema.js";
import {
	apiDefaultErrorResponseSchema,
	apiSuccessResponseSchema,
	apiValidationErrorResponseSchema
} from "@/schemas/api-schema.js";
import { addressResponseSchema } from "@/schemas/response-schema.js";

export const findAddressRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/:id",
		{
			schema: {
				tags: ["Addresses"],
				summary: "Encontrar um endereço",
				params: addressParamsSchema,
				response: {
					200: apiSuccessResponseSchema(addressResponseSchema),
					401: apiDefaultErrorResponseSchema,
					403: apiDefaultErrorResponseSchema,
					404: apiDefaultErrorResponseSchema,
					422: apiValidationErrorResponseSchema,
					500: apiDefaultErrorResponseSchema
				}
			},
			onRequest: [
				isAuthenticated,
				ensureUserHasPermission([PermissionType.MANAGE_OWN_ADDRESSES]),
				ensureIsResourceOwner("address")
			]
		},
		async (request, reply) => {
			const { id } = request.params;

			const findAddressService = makeFindAddressService();

			const address = await findAddressService.handle({
				id,
				filterParams: { establishment_id: request.user.primaryTenantId }
			});

			return reply
				.status(HTTPStatusCodes.OK)
				.send(ApiResponse.success("Endereço encontrado com sucesso", address));
		}
	);
};
