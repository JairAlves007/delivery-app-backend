import { makeOrderRepository } from "@/factories/repositories/make-order-repository.ts";
import { ListOrderService } from "@/services/order/list-order-service.ts";

export const makeListOrderService = () => {
	const orderRepository = makeOrderRepository();
	return new ListOrderService(orderRepository);
};
