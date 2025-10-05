import { makeOrderRepository } from "@/factories/repositories/make-order-repository.ts";
import { UpdateOrderService } from "@/services/order/update-order-service.ts";

export const makeUpdateOrderService = () => {
	const orderRepository = makeOrderRepository();
	return new UpdateOrderService(orderRepository);
};
