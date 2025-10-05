import { makeOrderRepository } from "@/factories/repositories/make-order-repository.ts";
import { CreateOrderService } from "@/services/order/create-order-service.ts";

export const makeCreateOrderService = () => {
	const orderRepository = makeOrderRepository();
	return new CreateOrderService(orderRepository);
};
