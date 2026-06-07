import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { SseConnectionManager } from "@/classes/sse-connection-manager.js";
import { env } from "@/env.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import Constants from "@/helpers/constants.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { sseStreamQuerySchema } from "@/schemas/notification-schema.js";

type SseTicketPayload = {
  userId: string;
  establishmentId: string;
};

const isProduction = env.NODE_ENV === "production";

const resolveAllowedOrigin = (origin?: string): string | null => {
  if (!origin) return null;
  if (!isProduction) return origin;

  const allowed = env.ALLOWED_ORIGINS.split(",").map((item) => item.trim());

  return allowed.includes(origin) ? origin : null;
};

export const streamNotificationsRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/stream",
    {
      schema: {
        operationId: "streamNotifications",
        hide: true,
        querystring: sseStreamQuerySchema,
      },
    },
    async (request, reply) => {
      const { ticket } = request.query;

      const cache = makeCache();
      const ticketKey = `${Constants.SSE_TICKET_PREFIX}${ticket}`;
      const payload = await cache.get<SseTicketPayload>(ticketKey);

      if (!payload) {
        return reply.status(HTTPStatusCodes.UNAUTHORIZED).send();
      }

      await cache.forget(ticketKey);

      const { establishmentId } = payload;
      const manager = SseConnectionManager.getInstance();
      const allowedOrigin = resolveAllowedOrigin(request.headers.origin);

      reply.hijack();

      reply.raw.writeHead(HTTPStatusCodes.OK, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
        ...(allowedOrigin
          ? { "Access-Control-Allow-Origin": allowedOrigin }
          : {}),
      });

      reply.raw.write("event: connected\ndata: {}\n\n");

      await manager.add(establishmentId, reply.raw);

      const heartbeat = setInterval(() => {
        reply.raw.write(": keep-alive\n\n");
      }, Constants.SSE_HEARTBEAT_MS);

      request.raw.on("close", () => {
        clearInterval(heartbeat);
        void manager.remove(establishmentId, reply.raw);
      });
    },
  );
};
