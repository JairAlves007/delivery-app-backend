import { scheduleBillingDueCheck } from "@/queues/billing-due-queue.js";
import { scheduleNotificationCleanup } from "@/queues/notification-cleanup-queue.js";
import { scheduleComputeRecommendations } from "@/queues/recommendation-queue.js";

import { setupForgetAllListingCacheKeysWorker } from "./cache/forget-all-listing-cache-keys-worker.js";
import { setupGenerateDigitalMenuWorker } from "./digital-menu/generate-digital-menu-worker.js";
import { setupCheckBillingDueWorker } from "./notification/check-billing-due-worker.js";
import { setupCleanupNotificationsWorker } from "./notification/cleanup-notifications-worker.js";
import { setupCreateNotificationWorker } from "./notification/create-notification-worker.js";
import { setupCreateOrderWorker } from "./order/create-order-worker.js";
import { setupComputeProductRecommendationsWorker } from "./recommendation/compute-product-recommendations-worker.js";
import { setupDeleteResourceWorker } from "./resource/delete-resource-worker.js";
import { setupCleanupWhatsappInstanceWorker } from "./whatsapp/cleanup-whatsapp-instance-worker.js";
import { setupSendWhatsappMessageWorker } from "./whatsapp/send-whatsapp-message-worker.js";

export const setupWorkers = async () => {
  setupForgetAllListingCacheKeysWorker();
  setupCreateOrderWorker();
  setupDeleteResourceWorker();
  setupSendWhatsappMessageWorker();
  setupCleanupWhatsappInstanceWorker();
  setupGenerateDigitalMenuWorker();
  setupCreateNotificationWorker();
  setupCleanupNotificationsWorker();
  setupCheckBillingDueWorker();
  setupComputeProductRecommendationsWorker();

  await scheduleNotificationCleanup();
  await scheduleBillingDueCheck();
  await scheduleComputeRecommendations();
};
