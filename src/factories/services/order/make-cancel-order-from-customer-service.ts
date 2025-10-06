import { makeOrderRepository } from "@/factories/repositories/make-order-repository.ts";
import { CancelOrderFromCustomerService } from "@/services/order/cancel-order-from-customer-service.ts";

export const makeCancelOrderFromCustomerService = () => {
	const orderRepository = makeOrderRepository();
	return new CancelOrderFromCustomerService(orderRepository);
};
