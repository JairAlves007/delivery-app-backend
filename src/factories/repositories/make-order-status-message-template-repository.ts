import { OrderStatusMessageTemplatePrismaRepository } from "@/repositories/order-status-message-template-prisma-repository.js";

export const makeOrderStatusMessageTemplateRepository = () => {
	return new OrderStatusMessageTemplatePrismaRepository();
};
