import { makeOrderRepository } from "@/factories/repositories/make-order-repository.js";
import { UpdateOrderService } from "@/services/order/update-order-service.js";

export const makeUpdateOrderService = () => {
	const orderRepository = makeOrderRepository();
	return new UpdateOrderService(orderRepository);
};
