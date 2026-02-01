import { setupForgetAllListingCacheKeysWorker } from "./cache/forget-all-listing-cache-keys-worker.ts";
import { setupCreateMenuForNewEstablishmentWorker } from "./establishment/create-menu-for-new-establishment-worker.ts";
import { setupSendOrderConfirmationMessageWorker } from "./mail/send-order-confirmation-message-worker.ts";
import { setupSendResetPasswordMailWorker } from "./mail/send-reset-password-mail-worker.ts";
import { setupCreateOrderWorker } from "./order/create-order-worker.ts";

export const setupWorkers = () => {
	setupForgetAllListingCacheKeysWorker();
	setupCreateMenuForNewEstablishmentWorker();
	setupSendOrderConfirmationMessageWorker();
	setupSendResetPasswordMailWorker();
	setupCreateOrderWorker();
};
