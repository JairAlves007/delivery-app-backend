import z from "zod";

import {
	DeliveryType,
	OrderStatusType,
	PaymentMethodType
} from "@/generated/prisma/client.js";

import { establishmentIdSchema, phoneSchema } from "./generic-schema.js";

export const createOrderBodySchema = z
	.object({
		establishmentId: establishmentIdSchema,
		contactPhone: phoneSchema.optional().nullable(),
		addressId: z
			.ulid("O endereço deve ser preenchido")
			.min(1, "O endereço deve ser preenchido")
			.optional()
			.nullable(),
		districtId: z
			.ulid("O bairro deve ser preenchido")
			.min(1, "O bairro deve ser preenchido")
			.optional()
			.nullable(),
		couponId: z.coerce
			.number("O cupom deve ser preenchido")
			.int()
			.min(1, "O cupom deve ser preenchido")
			.optional()
			.nullable(),
		comment: z
			.string("O comentário deve ser preenchido")
			.trim()
			.min(1, "O comentário deve ser preenchido")
			.max(500, "O comentário deve ter no máximo 500 caracteres")
			.optional()
			.nullable(),
		paymentMethod: z.enum(
			PaymentMethodType,
			"O método de pagamento deve ser preenchido"
		),
		deliveryType: z.enum(DeliveryType, "O tipo de entrega deve ser preenchido"),
		changeAmount: z.coerce
			.number()
			.int()
			.min(0, "O troco deve ser maior ou igual a zero")
			.optional()
			.nullable(),
		items: z
			.array(
				z.object({
					id: z
						.string("O id deve ser preenchido")
						.min(1, "O id deve ser maior que zero"),
					quantity: z
						.number("A quantidade deve ser preenchida")
						.int("A quantidade deve ser um número inteiro")
						.min(1, "A quantidade deve ser maior que zero"),
					addonCategories: z
						.array(
							z.object({
								id: z.coerce
									.number("O id deve ser preenchido")
									.int()
									.min(1, "O id deve ser maior que zero"),
								addons: z.array(
									z.object({
										id: z.coerce
											.number("O id deve ser preenchido")
											.int()
											.min(1, "O id deve ser maior que zero"),
										quantity: z
											.number("A quantidade deve ser preenchida")
											.int()
											.min(1, "A quantidade deve ser maior que zero")
											.default(1)
									})
								)
							})
						)
						.optional()
						.nullable()
				})
			)
			.min(1, "O pedido deve ter ao menos um item")
	})
	.superRefine((data, ctx) => {
		if (
			data.paymentMethod === PaymentMethodType.MONEY &&
			(data.changeAmount === undefined ||
				data.changeAmount === null ||
				data.changeAmount < 0)
		) {
			ctx.addIssue({
				path: ["changeAmount"],
				code: "custom",
				message: "O troco deve ser preenchido"
			});
		}

		if (data.deliveryType === DeliveryType.DELIVERY) {
			if (!data.addressId) {
				ctx.addIssue({
					path: ["addressId"],
					code: "custom",
					message: "O endereço deve ser preenchido"
				});
			}

			if (!data.districtId) {
				ctx.addIssue({
					path: ["districtId"],
					code: "custom",
					message: "O bairro deve ser preenchido"
				});
			}
		} else {
			if (!data.contactPhone) {
				ctx.addIssue({
					path: ["contactPhone"],
					code: "custom",
					message: "Precisamos saber o telefone para contato sobre o pedido"
				});
			}
		}
	})
	.transform(data => {
		if (data.paymentMethod !== PaymentMethodType.MONEY) {
			return {
				...data,
				changeAmount: null
			};
		}

		return data;
	});

z.globalRegistry.add(createOrderBodySchema, { id: "CreateOrderBody" });

export const cancelOrderBodySchema = z.object({
	establishmentId: establishmentIdSchema
});

z.globalRegistry.add(cancelOrderBodySchema, { id: "CancelOrderBody" });

export const updateOrderStatusBodySchema = cancelOrderBodySchema.extend({
	status: z.enum(OrderStatusType, "O status do pedido deve ser preenchido")
});

z.globalRegistry.add(updateOrderStatusBodySchema, {
	id: "UpdateOrderStatusBody"
});

export const orderParamsSchema = z.object({
	id: z.ulid().min(1, "O id do pedido deve ser preenchido")
});
