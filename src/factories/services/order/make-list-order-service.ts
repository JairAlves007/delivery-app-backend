import { makeOrderRepository } from "@/factories/repositories/make-order-repository.js";
import { ListOrderService } from "@/services/order/list-order-service.js";

export const makeListOrderService = () => {
	const orderRepository = makeOrderRepository();
	return new ListOrderService(orderRepository);
};
