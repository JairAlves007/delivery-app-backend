import { randomBytes } from "node:crypto";

import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeCache } from "@/factories/services/cache/make-cache.js";
import { ApiResponse } from "@/helpers/api.js";
import Constants from "@/helpers/constants.js";
import { getUserEstablishmentId } from "@/helpers/get-user-establishment-id.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { adminTags } from "@/http/swagger-tags.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import {
  apiDefaultErrorResponseSchema,
  apiSuccessResponseSchema,
} from "@/schemas/api-schema.js";
import { sseTicketResponseSchema } from "@/schemas/response-schema.js";

export const createSseTicketRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/sse-ticket",
    {
      schema: {
        operationId: "createNotificationSseTicket",
        tags: adminTags("Notificações"),
        summary: "Gerar ticket de conexão ao stream de notificações",
        response: {
          201: apiSuccessResponseSchema(sseTicketResponseSchema),
          401: apiDefaultErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
      onRequest: [isAuthenticated],
    },
    async (request, reply) => {
      const establishmentId = getUserEstablishmentId(request.user);
      const userId = request.user.sub;

      const ticket = randomBytes(24).toString("hex");
      const cache = makeCache();

      await cache.set(
        `${Constants.SSE_TICKET_PREFIX}${ticket}`,
        { userId, establishmentId },
        Constants.SSE_TICKET_TTL_SECONDS,
      );

      return reply.status(HTTPStatusCodes.CREATED).send(
        ApiResponse.success("Ticket gerado com sucesso", {
          ticket,
          expiresIn: Constants.SSE_TICKET_TTL_SECONDS,
        }),
      );
    },
  );
};
