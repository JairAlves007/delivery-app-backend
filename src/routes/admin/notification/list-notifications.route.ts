import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeListNotificationsService } from "@/factories/services/notification/make-list-notifications-service.js";
import { ApiResponse } from "@/helpers/api.js";
import { getUserEstablishmentId } from "@/helpers/get-user-establishment-id.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { adminTags } from "@/http/swagger-tags.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import {
  apiDefaultErrorResponseSchema,
  apiSuccessResponseSchema,
} from "@/schemas/api-schema.js";
import { listNotificationsQuerySchema } from "@/schemas/notification-schema.js";
import { notificationListResponseSchema } from "@/schemas/response-schema.js";

export const listNotificationsRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/",
    {
      schema: {
        operationId: "listNotifications",
        tags: adminTags("Notificações"),
        summary: "Listar notificações do usuário",
        querystring: listNotificationsQuerySchema,
        response: {
          200: apiSuccessResponseSchema(notificationListResponseSchema),
          401: apiDefaultErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
      onRequest: [isAuthenticated],
    },
    async (request, reply) => {
      const establishmentId = getUserEstablishmentId(request.user);
      const { limit, cursor } = request.query;

      const listNotificationsService = makeListNotificationsService();

      const result = await listNotificationsService.handle({
        establishmentId,
        userId: request.user.sub,
        limit,
        cursor,
      });

      return reply
        .status(HTTPStatusCodes.OK)
        .send(ApiResponse.success("Notificações obtidas com sucesso", result));
    },
  );
};
