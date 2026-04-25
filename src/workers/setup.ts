import { setupForgetAllListingCacheKeysWorker } from "./cache/forget-all-listing-cache-keys-worker.js";
import { setupSendOrderConfirmationMessageWorker } from "./mail/send-order-confirmation-message-worker.js";
import { setupSendResetPasswordMailWorker } from "./mail/send-reset-password-mail-worker.js";
import { setupCreateOrderWorker } from "./order/create-order-worker.js";

export const setupWorkers = () => {
  setupForgetAllListingCacheKeysWorker();
  setupSendOrderConfirmationMessageWorker();
  setupSendResetPasswordMailWorker();
  setupCreateOrderWorker();
};
