import { makeOrderRepository } from "@/factories/repositories/make-order-repository.js";
import { ListMyOrdersService } from "@/services/order/list-my-orders-service.js";

export const makeListMyOrdersService = () => {
	const orderRepository = makeOrderRepository();
	return new ListMyOrdersService(orderRepository);
};
