import { makeQueue } from "@/factories/services/queue/make-queue.js";
import Constants from "@/helpers/constants.js";

export const billingDueQueueName = "billing-due-queue";

export const scheduleBillingDueCheck = async () => {
  const queue = makeQueue<Record<string, never>>(billingDueQueueName);

  await queue.scheduleRepeatable({
    schedulerId: Constants.BILLING_DUE_SCHEDULER_ID,
    pattern: Constants.BILLING_DUE_CRON,
    tz: Constants.DASHBOARD_TIMEZONE,
    job: { name: "check-billing-due", data: {} },
  });
};
