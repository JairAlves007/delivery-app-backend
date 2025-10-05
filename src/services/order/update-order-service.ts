import { getStatusLabel } from "@/helpers/order.ts";
import { IOrderRepository } from "@/interfaces/repositories/order-repository.ts";
import { updateOrderBodySchema } from "@/schemas/order-schema.ts";
import z from "zod";

type UpdateOrderRequest = z.infer<typeof updateOrderBodySchema>;

export class UpdateOrderService {
	private orderRepository: IOrderRepository;

	constructor(orderRepository: IOrderRepository) {
		this.orderRepository = orderRepository;
	}

	async handle(id: string, { status }: UpdateOrderRequest) {
		return await this.orderRepository.update({
			id,
			data: {
				statuses: {
					create: {
						label: getStatusLabel(status),
						value: status
					}
				}
			}
		});
	}
}
