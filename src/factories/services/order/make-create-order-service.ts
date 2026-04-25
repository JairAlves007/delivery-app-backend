import { makeOrderRepository } from "@/factories/repositories/make-order-repository.js";
import { CreateOrderService } from "@/services/order/create-order-service.js";

export const makeCreateOrderService = () => {
  const orderRepository = makeOrderRepository();
  return new CreateOrderService(orderRepository);
};
