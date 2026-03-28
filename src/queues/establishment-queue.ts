import { makeQueue } from "@/factories/services/queue/make-queue.js";
import type { CreateMenuForNewEstablishmentType } from "@/types/establishment.js";

export const establishmentQueueName = "establishment-queue";

export const createMenuForNewEstablishmentQueue = async (
	payload: CreateMenuForNewEstablishmentType
) => {
	const queue = makeQueue<CreateMenuForNewEstablishmentType>(
		establishmentQueueName
	);

	await queue.enqueue("create-menu-for-new-establishment", payload);
};
