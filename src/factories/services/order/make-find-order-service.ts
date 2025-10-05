import { makeOrderRepository } from "@/factories/repositories/make-order-repository.ts";
import { FindOrderService } from "@/services/order/find-order-service.ts";

export const makeFindOrderService = () => {
	const orderRepository = makeOrderRepository();
	return new FindOrderService(orderRepository);
};
