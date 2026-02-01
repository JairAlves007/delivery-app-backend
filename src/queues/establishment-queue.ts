import { makeQueue } from "@/factories/services/queue/make-queue.ts";
import type { CreateMenuForNewEstablishmentType } from "@/types/establishment.ts";

export const establishmentQueueName = "establishment-queue";

export const createMenuForNewEstablishmentQueue = async (
	payload: CreateMenuForNewEstablishmentType
) => {
	const queue = makeQueue<CreateMenuForNewEstablishmentType>(
		establishmentQueueName
	);

	await queue.enqueue("create-menu-for-new-establishment", payload);
};
