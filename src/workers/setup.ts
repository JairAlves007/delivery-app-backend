import { scheduleNotificationCleanup } from "@/queues/notification-cleanup-queue.js";

import { setupForgetAllListingCacheKeysWorker } from "./cache/forget-all-listing-cache-keys-worker.js";
import { setupGenerateDigitalMenuWorker } from "./digital-menu/generate-digital-menu-worker.js";
import { setupCleanupNotificationsWorker } from "./notification/cleanup-notifications-worker.js";
import { setupCreateNotificationWorker } from "./notification/create-notification-worker.js";
import { setupCreateOrderWorker } from "./order/create-order-worker.js";
import { setupDeleteResourceWorker } from "./resource/delete-resource-worker.js";
import { setupSendWhatsappMessageWorker } from "./whatsapp/send-whatsapp-message-worker.js";

export const setupWorkers = async () => {
  setupForgetAllListingCacheKeysWorker();
  setupCreateOrderWorker();
  setupDeleteResourceWorker();
  setupSendWhatsappMessageWorker();
  setupGenerateDigitalMenuWorker();
  setupCreateNotificationWorker();
  setupCleanupNotificationsWorker();

  await scheduleNotificationCleanup();
};
