import type { FastifyInstance } from "fastify";

import { dismissNotificationRoute } from "./dismiss.route.js";
import { listNotificationsRoute } from "./list-notifications.route.js";
import { markAllNotificationsSeenRoute } from "./mark-all-seen.route.js";
import { markNotificationSeenRoute } from "./mark-seen.route.js";
import { createSseTicketRoute } from "./sse-ticket.route.js";
import { streamNotificationsRoute } from "./stream.route.js";
import { unseenCountRoute } from "./unseen-count.route.js";

export const adminNotificationRoutes = async (app: FastifyInstance) => {
  app.register(listNotificationsRoute);
  app.register(unseenCountRoute);
  app.register(markAllNotificationsSeenRoute);
  app.register(markNotificationSeenRoute);
  app.register(dismissNotificationRoute);
  app.register(createSseTicketRoute);
  app.register(streamNotificationsRoute);
};
