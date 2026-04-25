import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { UserNotFound } from "@/errors/user/user-not-found.js";
import { makeFindEstablishmentByIdService } from "@/factories/services/establishment/make-find-establishment-by-id-service.js";
import { makeGetMenuService } from "@/factories/services/menu/make-get-menu-service.js";
import { makeFindUserService } from "@/factories/services/user/make-find-user-service.js";
import { ApiResponse } from "@/helpers/api.js";
import { isEstablishmentOpen } from "@/helpers/establishment.js";
import { getUserEstablishmentId } from "@/helpers/get-user-establishment-id.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import {
	apiDefaultErrorResponseSchema,
	apiSuccessResponseSchema
} from "@/schemas/api-schema.js";
import { userIdSchema } from "@/schemas/generic-schema.js";
import { meResponseSchema } from "@/schemas/response-schema.js";

export const meRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/me",
		{
			schema: {
				operationId: "me",
				tags: ["Auth"],
				summary: "Retorna usuário, estabelecimento ativo e menu",
				response: {
					200: apiSuccessResponseSchema(meResponseSchema),
					401: apiDefaultErrorResponseSchema,
					404: apiDefaultErrorResponseSchema,
					500: apiDefaultErrorResponseSchema
				}
			},
			onRequest: [isAuthenticated]
		},
		async (request, reply) => {
			const userId = userIdSchema.parse(request.user.sub);
			const { role } = request.user;
			const establishmentId = getUserEstablishmentId(request.user);

			const findUserService = makeFindUserService();
			const menuService = makeGetMenuService();
			const findEstablishmentByIdService = makeFindEstablishmentByIdService();

			const [user, establishmentData, menu] = await Promise.all([
				findUserService.handle(userId),
				findEstablishmentByIdService.handle({ id: establishmentId }),
				menuService.handle(role)
			]);

			if (!user) {
				throw new UserNotFound();
			}

			return reply.status(HTTPStatusCodes.OK).send(
				ApiResponse.success("Sessão recuperada com sucesso", {
					user: {
						id: user.id,
						name: user.name,
						email: user.email,
						role
					},
					establishment: {
						...establishmentData,
						isOpen: isEstablishmentOpen(establishmentData)
					},
					menu
				})
			);
		}
	);
};
