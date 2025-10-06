import { makeOrderRepository } from "@/factories/repositories/make-order-repository.ts";
import { ListMyOrdersService } from "@/services/order/list-my-orders-service.ts";

export const makeListMyOrdersService = () => {
	const orderRepository = makeOrderRepository();
	return new ListMyOrdersService(orderRepository);
};
