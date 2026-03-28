import { makeCreateMenuForNewEstablishmentService } from "@/factories/services/menu/make-create-menu-for-new-establishment-service.js";
import { makeQueue } from "@/factories/services/queue/make-queue.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import { establishmentQueueName } from "@/queues/establishment-queue.js";
import type { CreateMenuForNewEstablishmentType } from "@/types/establishment.js";

export const setupCreateMenuForNewEstablishmentWorker = async () => {
	const establishmentQueue = makeQueue<CreateMenuForNewEstablishmentType>(
		establishmentQueueName
	);

	establishmentQueue.registerProcessor(
		async ({ establishmentId, paramsToForget }) => {
			const createMenuService = makeCreateMenuForNewEstablishmentService();

			try {
				await createMenuService.handle({
					establishmentId,
					paramsToForget: { establishment_id: establishmentId }
				});

				await forgetAllListingCacheKeysQueue({
					baseCacheKey: "establishments",
					paramsToForget: paramsToForget
				});
			} catch (error) {
				console.log(
					"[Worker] Error creating menu for new establishment:",
					error
				);
			}
		}
	);
};
