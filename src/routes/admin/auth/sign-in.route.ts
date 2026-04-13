import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeSignInService } from "@/factories/services/auth/make-sign-in-service.js";
import { makeFindEstablishmentByIdService } from "@/factories/services/establishment/make-find-establishment-by-id-service.js";
import { makeGetMenuService } from "@/factories/services/menu/make-get-menu-service.js";
import { RoleType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import Constants from "@/helpers/constants.js";
import { isEstablishmentOpen } from "@/helpers/establishment.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import {
	apiDefaultErrorResponseSchema,
	apiSuccessResponseSchema,
	apiValidationErrorResponseSchema
} from "@/schemas/api-schema.js";
import { signInBodySchema } from "@/schemas/auth-schema.js";
import { signInAdminResponseSchema } from "@/schemas/response-schema.js";

export const signInRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/sign-in",
		{
			schema: {
				operationId: "adminSignIn",
				tags: ["Admin Auth"],
				summary: "Autenticar administrador",
				body: signInBodySchema,
				response: {
					200: apiSuccessResponseSchema(signInAdminResponseSchema),
					401: apiDefaultErrorResponseSchema,
					404: apiDefaultErrorResponseSchema,
					422: apiValidationErrorResponseSchema,
					500: apiDefaultErrorResponseSchema
				}
			}
		},
		async (request, reply) => {
			const body = request.body;

			const signInService = makeSignInService();
			const menuService = makeGetMenuService();
			const findEstablishmentByIdService = makeFindEstablishmentByIdService();

			const { user, establishmentId } = await signInService.handle({
				...body,
				allowedRoles: [RoleType.ADMIN, RoleType.ESTABLISHMENT_OWNER]
			});

			const [establishmentData, menu] = await Promise.all([
				findEstablishmentByIdService.handle({ id: establishmentId }),
				menuService.handle(user.role.name, establishmentId)
			]);

			const token = await reply.jwtSign(
				{
					role: user.role.name,
					activeTenantId: establishmentId,
					primaryTenantId: user.establishment?.id ?? null
				},
				{
					sub: user.id,
					expiresIn: Constants.ACCESS_TOKEN_EXPIRATION_TIME
				}
			);

			return reply.status(HTTPStatusCodes.OK).send(
				ApiResponse.success("Usuário autenticado com sucesso", {
					user: {
						id: user.id,
						name: user.name,
						email: user.email
					},
					establishment: {
						...establishmentData,
						isOpen: isEstablishmentOpen(establishmentData)
					},
					menu,
					type: Constants.TOKEN_TYPE,
					expiresIn: Constants.ACCESS_TOKEN_EXPIRATION_IN_SECONDS,
					token
				})
			);
		}
	);
};
