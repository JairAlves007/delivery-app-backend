import { setupForgetAllListingCacheKeysWorker } from "./cache/forget-all-listing-cache-keys-worker.js";
import { setupCreateOrderWorker } from "./order/create-order-worker.js";
import { setupDeleteResourceWorker } from "./resource/delete-resource-worker.js";

export const setupWorkers = () => {
  setupForgetAllListingCacheKeysWorker();
  setupCreateOrderWorker();
  setupDeleteResourceWorker();
};
