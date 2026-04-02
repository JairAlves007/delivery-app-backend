import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeUpdateAddressService } from "@/factories/services/address/make-update-address-service.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { ensureIsResourceOwner } from "@/middlewares/ensure-is-resource-owner.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import {
	addressParamsSchema,
	updateAddressBodySchema
} from "@/schemas/address-schema.js";
import {
	apiDefaultErrorResponseSchema,
	apiSuccessResponseSchema,
	apiValidationErrorResponseSchema
} from "@/schemas/api-schema.js";
import { userIdSchema } from "@/schemas/generic-schema.js";

export const updateAddressRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().patch(
		"/:id",
		{
			schema: {
				operationId: "updateAddress",
				tags: ["Addresses"],
				summary: "Atualizar um endereço",
				params: addressParamsSchema,
				body: updateAddressBodySchema,
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
				ensureUserHasPermission([PermissionType.MANAGE_OWN_ADDRESSES]),
				ensureIsResourceOwner("address")
			]
		},
		async (request, reply) => {
			const { id } = request.params;
			const userId = userIdSchema.parse(request.user.sub);
			const body = request.body;

			const updateAddressService = makeUpdateAddressService();

			await updateAddressService.handle({
				id,
				userId,
				...body,
				paramsToForget: {
					user_id: userId
				}
			});

			return reply
				.status(HTTPStatusCodes.NO_CONTENT)
				.send(ApiResponse.success("Endereço atualizado com sucesso", {}));
		}
	);
};
