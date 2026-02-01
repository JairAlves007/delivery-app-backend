import { IOrderRepository } from "@/interfaces/repositories/order-repository.ts";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.ts";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.ts";

type DeleteOrderServiceParams = {
	id: string;
} & Pick<ForgetAllListingCacheKeysParams, "paramsToForget">;

export class DeleteOrderService {
	private orderRepository: IOrderRepository;

	constructor(orderRepository: IOrderRepository) {
		this.orderRepository = orderRepository;
	}

	async handle({ id, paramsToForget }: DeleteOrderServiceParams) {
		await this.orderRepository.delete({ id, force: false });

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "orders",
			paramsToForget
		});
	}
}
