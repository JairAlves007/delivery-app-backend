import { OrderPrismaRepository } from "@/repositories/order-prisma-repository.ts";

export const makeOrderRepository = () => {
	return new OrderPrismaRepository();
};
