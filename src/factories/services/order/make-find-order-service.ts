import { makeOrderRepository } from "@/factories/repositories/make-order-repository.js";
import { FindOrderService } from "@/services/order/find-order-service.js";

export const makeFindOrderService = () => {
  const orderRepository = makeOrderRepository();
  return new FindOrderService(orderRepository);
};
