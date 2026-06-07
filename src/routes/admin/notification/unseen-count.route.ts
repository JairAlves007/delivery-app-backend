import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeUnseenCountService } from "@/factories/services/notification/make-unseen-count-service.js";
import { ApiResponse } from "@/helpers/api.js";
import { getUserEstablishmentId } from "@/helpers/get-user-establishment-id.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { adminTags } from "@/http/swagger-tags.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import {
  apiDefaultErrorResponseSchema,
  apiSuccessResponseSchema,
} from "@/schemas/api-schema.js";
import { notificationUnseenCountResponseSchema } from "@/schemas/response-schema.js";

export const unseenCountRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/unseen-count",
    {
      schema: {
        operationId: "getNotificationsUnseenCount",
        tags: adminTags("Notificações"),
        summary: "Consultar quantidade de notificações não vistas",
        response: {
          200: apiSuccessResponseSchema(notificationUnseenCountResponseSchema),
          401: apiDefaultErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
      onRequest: [isAuthenticated],
    },
    async (request, reply) => {
      const establishmentId = getUserEstablishmentId(request.user);

      const unseenCountService = makeUnseenCountService();

      const result = await unseenCountService.handle({
        establishmentId,
        userId: request.user.sub,
      });

      return reply
        .status(HTTPStatusCodes.OK)
        .send(ApiResponse.success("Contagem obtida com sucesso", result));
    },
  );
};
