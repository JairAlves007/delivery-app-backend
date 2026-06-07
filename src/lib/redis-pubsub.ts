import { Redis } from "ioredis";

import { env } from "@/env.js";
import Constants from "@/helpers/constants.js";

const buildConnection = () =>
  new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD,
  });

export const notificationPublisher = buildConnection();

export const notificationSubscriber = buildConnection();

export const buildNotificationChannel = (establishmentId: string) =>
  `${Constants.NOTIFICATION_CHANNEL_PREFIX}${establishmentId}`;
