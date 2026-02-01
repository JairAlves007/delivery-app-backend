import { makeCreateMenuForNewEstablishmentService } from "@/factories/services/menu/make-create-menu-for-new-establishment-service.ts";
import { makeQueue } from "@/factories/services/queue/make-queue.ts";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.ts";
import { establishmentQueueName } from "@/queues/establishment-queue.ts";
import type { CreateMenuForNewEstablishmentType } from "@/types/establishment.ts";

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
