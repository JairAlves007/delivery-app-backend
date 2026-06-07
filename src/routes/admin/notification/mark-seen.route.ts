import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeMarkNotificationSeenService } from "@/factories/services/notification/make-mark-notification-seen-service.js";
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

export const markNotificationSeenRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().patch(
    "/:id/seen",
    {
      schema: {
        operationId: "markNotificationSeen",
        tags: adminTags("Notificações"),
        summary: "Marcar notificação como vista",
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

      const markNotificationSeenService = makeMarkNotificationSeenService();

      await markNotificationSeenService.handle({
        notificationId: id,
        establishmentId,
        userId: request.user.sub,
      });

      return reply
        .status(HTTPStatusCodes.OK)
        .send(ApiResponse.success("Notificação marcada como vista"));
    },
  );
};
