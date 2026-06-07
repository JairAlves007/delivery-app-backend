import { makeCheckBillingDueNotificationsService } from "@/factories/services/notification/make-check-billing-due-notifications-service.js";
import { makeQueue } from "@/factories/services/queue/make-queue.js";
import { app } from "@/http/app.js";
import { billingDueQueueName } from "@/queues/billing-due-queue.js";

export const setupCheckBillingDueWorker = () => {
  const billingDueQueue = makeQueue<Record<string, never>>(
    billingDueQueueName,
  );

  billingDueQueue.registerProcessor(async () => {
    const checkBillingDueNotificationsService =
      makeCheckBillingDueNotificationsService();

    const { notifiedCount } =
      await checkBillingDueNotificationsService.handle();

    app.log.info(
      { notifiedCount },
      "[Notification] billing due check finished",
    );
  });
};
