import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeExportDashboardService } from "@/factories/services/dashboard/make-export-dashboard-service.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { getUserEstablishmentId } from "@/helpers/get-user-establishment-id.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { adminTags } from "@/http/swagger-tags.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import { dashboardExportQuerySchema } from "@/schemas/dashboard-schema.js";

export const exportDashboardRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/export",
    {
      schema: {
        operationId: "exportDashboard",
        tags: adminTags("Dashboard"),
        summary: "Exportar relatório do dashboard em planilha (xlsx ou csv)",
        querystring: dashboardExportQuerySchema,
      },
      onRequest: [
        isAuthenticated,
        ensureUserHasPermission([PermissionType.VIEW_DASHBOARD]),
      ],
    },
    async (request, reply) => {
      const { from, to, granularity, format } = request.query;
      const establishmentId = getUserEstablishmentId(request.user);

      const exportDashboardService = makeExportDashboardService();

      const { buffer, fileName, mimeType } = await exportDashboardService.handle(
        {
          from,
          to,
          granularity,
          format,
          establishmentId,
        },
      );

      return reply
        .status(HTTPStatusCodes.OK)
        .header("Content-Type", mimeType)
        .header("Content-Disposition", `attachment; filename="${fileName}"`)
        .send(buffer);
    },
  );
};
