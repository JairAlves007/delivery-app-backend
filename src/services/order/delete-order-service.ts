import { makeCache } from "@/factories/services/cache/make-cache.ts";
import { IOrderRepository } from "@/interfaces/repositories/order-repository.ts";

export class DeleteOrderService {
	private orderRepository: IOrderRepository;

	constructor(orderRepository: IOrderRepository) {
		this.orderRepository = orderRepository;
	}

	async handle(id: string) {
		const cache = makeCache();

		await this.orderRepository.delete({ id, force: false });

		await cache.forgetKeysContaining(cache.keys.orders);
	}
}
