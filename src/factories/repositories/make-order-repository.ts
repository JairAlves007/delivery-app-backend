import { OrderPrismaRepository } from "@/repositories/order-prisma-repository.js";

export const makeOrderRepository = () => {
	return new OrderPrismaRepository();
};
