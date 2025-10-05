import { makeOrderRepository } from "@/factories/repositories/make-order-repository.ts";
import { DeleteOrderService } from "@/services/order/delete-order-service.ts";

export const makeDeleteOrderService = () => {
	const orderRepository = makeOrderRepository();
	return new DeleteOrderService(orderRepository);
};
