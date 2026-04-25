import { makeOrderRepository } from "@/factories/repositories/make-order-repository.js";
import { CancelOrderFromCustomerService } from "@/services/order/cancel-order-from-customer-service.js";

export const makeCancelOrderFromCustomerService = () => {
  const orderRepository = makeOrderRepository();
  return new CancelOrderFromCustomerService(orderRepository);
};
