import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeDismissNotificationService } from "@/factories/services/notification/make-dismiss-notification-service.js";
import { ApiResponse } from "@/helpers/api.js";
import { getUserEstablishmentId } from "@/helpers/get-user-establishment-id.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { adminTags } from "@/http/swagger-tags.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import {
  apiDefaultErrorResponseSchema,
  apiSuccessResponseSchema,
} from "@/schemas/api-schema.js";
import { notificationParamsSchema } from "@/schemas/notification-schema.js";

export const dismissNotificationRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/:id",
    {
      schema: {
        operationId: "dismissNotification",
        tags: adminTags("Notificações"),
        summary: "Excluir notificação para o usuário",
        params: notificationParamsSchema,
        response: {
          200: apiSuccessResponseSchema(z.object({})),
          401: apiDefaultErrorResponseSchema,
          404: apiDefaultErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
      onRequest: [isAuthenticated],
    },
    async (request, reply) => {
      const establishmentId = getUserEstablishmentId(request.user);
      const { id } = request.params;

      const dismissNotificationService = makeDismissNotificationService();

      await dismissNotificationService.handle({
        notificationId: id,
        establishmentId,
        userId: request.user.sub,
      });

      return reply
        .status(HTTPStatusCodes.OK)
        .send(ApiResponse.success("Notificação excluída com sucesso"));
    },
  );
};
