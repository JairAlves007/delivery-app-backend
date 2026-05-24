import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { EstablishmentNotFound } from "@/errors/establishment/not-found-error.js";
import { makeGetEstablishmentThemeService } from "@/factories/services/establishment-theme/make-get-establishment-theme-service.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import { getUserEstablishmentId } from "@/helpers/get-user-establishment-id.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { adminTags } from "@/http/swagger-tags.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import {
	apiDefaultErrorResponseSchema,
	apiSuccessResponseSchema,
	apiValidationErrorResponseSchema
} from "@/schemas/api-schema.js";
import { establishmentThemeResponseSchema } from "@/schemas/response-schema.js";

export const findMyEstablishmentThemeRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/my/theme",
		{
			schema: {
				operationId: "findMyEstablishmentTheme",
				tags: adminTags("Establishments"),
				summary: "Buscar tema do meu estabelecimento",
				response: {
					200: apiSuccessResponseSchema(establishmentThemeResponseSchema),
					401: apiDefaultErrorResponseSchema,
					403: apiDefaultErrorResponseSchema,
					404: apiDefaultErrorResponseSchema,
					422: apiValidationErrorResponseSchema,
					500: apiDefaultErrorResponseSchema
				}
			},
			onRequest: [
				isAuthenticated,
				ensureUserHasPermission([
					PermissionType.MANAGE_OWN_ESTABLISHMENT_THEME
				])
			]
		},
		async (request, reply) => {
			const establishmentId = getUserEstablishmentId(request.user);

			if (!establishmentId) throw new EstablishmentNotFound();

			const service = makeGetEstablishmentThemeService();
			const theme = await service.handle(establishmentId);

			return reply
				.status(HTTPStatusCodes.OK)
				.send(ApiResponse.success("Tema recuperado com sucesso", theme));
		}
	);
};
