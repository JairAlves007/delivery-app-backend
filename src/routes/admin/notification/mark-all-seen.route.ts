import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeMarkAllNotificationsSeenService } from "@/factories/services/notification/make-mark-all-notifications-seen-service.js";
import { ApiResponse } from "@/helpers/api.js";
import { getUserEstablishmentId } from "@/helpers/get-user-establishment-id.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { adminTags } from "@/http/swagger-tags.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import {
  apiDefaultErrorResponseSchema,
  apiSuccessResponseSchema,
} from "@/schemas/api-schema.js";

export const markAllNotificationsSeenRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().patch(
    "/seen",
    {
      schema: {
        operationId: "markAllNotificationsSeen",
        tags: adminTags("Notificações"),
        summary: "Marcar todas as notificações como vistas",
        response: {
          200: apiSuccessResponseSchema(z.object({})),
          401: apiDefaultErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
      onRequest: [isAuthenticated],
    },
    async (request, reply) => {
      const establishmentId = getUserEstablishmentId(request.user);

      const markAllNotificationsSeenService =
        makeMarkAllNotificationsSeenService();

      await markAllNotificationsSeenService.handle({
        establishmentId,
        userId: request.user.sub,
      });

      return reply
        .status(HTTPStatusCodes.OK)
        .send(ApiResponse.success("Notificações marcadas como vistas"));
    },
  );
};
