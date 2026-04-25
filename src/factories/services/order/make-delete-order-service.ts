import { makeOrderRepository } from "@/factories/repositories/make-order-repository.js";
import { DeleteOrderService } from "@/services/order/delete-order-service.js";

export const makeDeleteOrderService = () => {
  const orderRepository = makeOrderRepository();
  return new DeleteOrderService(orderRepository);
};
