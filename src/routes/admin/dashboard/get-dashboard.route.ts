import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { UserUnauthorized } from "@/errors/user/user-unauthorized.js";
import { makeGetDashboardService } from "@/factories/services/dashboard/make-get-dashboard-service.js";
import { PermissionType, RoleType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import {
	apiDefaultErrorResponseSchema,
	apiSuccessResponseSchema,
	apiValidationErrorResponseSchema
} from "@/schemas/api-schema.js";
import { dashboardQuerySchema } from "@/schemas/dashboard-schema.js";
import { dashboardResponseSchema } from "@/schemas/response-schema.js";

export const getDashboardRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/",
		{
			schema: {
				operationId: "getDashboard",
				tags: ["Dashboard"],
				summary: "Obter dados agregados para o dashboard",
				querystring: dashboardQuerySchema,
				response: {
					200: apiSuccessResponseSchema(dashboardResponseSchema),
					401: apiDefaultErrorResponseSchema,
					403: apiDefaultErrorResponseSchema,
					422: apiValidationErrorResponseSchema,
					500: apiDefaultErrorResponseSchema
				}
			},
			onRequest: [
				isAuthenticated,
				ensureUserHasPermission([PermissionType.VIEW_DASHBOARD])
			]
		},
		async (request, reply) => {
			const { from, to, granularity, establishmentId } = request.query;
			const isAdmin = request.user.role === RoleType.ADMIN;

			const scopedEstablishmentId = isAdmin
				? establishmentId
				: (request.user.primaryTenantId ?? undefined);

			if (!isAdmin && !scopedEstablishmentId) {
				throw new UserUnauthorized();
			}

			const getDashboardService = makeGetDashboardService();

			const dashboard = await getDashboardService.handle({
				from,
				to,
				granularity,
				establishmentId: scopedEstablishmentId,
				isAdmin
			});

			return reply
				.status(HTTPStatusCodes.OK)
				.send(
					ApiResponse.success("Dashboard carregado com sucesso", dashboard)
				);
		}
	);
};
