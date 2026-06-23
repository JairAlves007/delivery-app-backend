import z from "zod";

import {
	DeliveryType,
	OrderStatusType,
	PaymentMethodType
} from "@/generated/prisma/client.js";

import {
	addressLocationSchema,
	listQueryParamsSchema,
	phoneSchema
} from "./generic-schema.js";

const comboOrderInputSchema = z
	.array(
		z.object({
			comboId: z.ulid("Combo inválido"),
			quantity: z.coerce
				.number("A quantidade deve ser preenchida")
				.int()
				.min(1, "A quantidade deve ser maior que zero")
				.default(1),
			selections: z
				.array(z.object({ productId: z.ulid("Produto inválido") }))
				.max(50, "Máximo de 50 seleções por combo")
				.default([])
		})
	)
	.max(20, "Máximo de 20 combos por pedido")
	.default([]);

export const createOrderBodySchema = z
	.object({
		establishmentId: z.ulid("O id do estabelecimento deve ser preenchido"),
		customerName: z
			.string()
			.trim()
			.min(1, "O nome deve ser preenchido")
			.max(255, "O nome deve ter no máximo 255 caracteres"),
		customerPhone: phoneSchema,
		address: addressLocationSchema
			.omit({ latitude: true, longitude: true })
			.optional()
			.nullable(),
		districtId: z
			.ulid("O bairro deve ser preenchido")
			.min(1, "O bairro deve ser preenchido")
			.optional()
			.nullable(),
		couponId: z
			.ulid("O cupom deve ser preenchido")
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
					weightGrams: z.coerce
						.number()
						.int("O peso deve ser um número inteiro de gramas")
						.min(1, "O peso deve ser maior que zero")
						.optional()
						.nullable(),
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
								.max(30, "Máximo de 30 adicionais por categoria")
							})
						)
						.max(20, "Máximo de 20 categorias de adicionais por item")
						.optional()
						.nullable()
				})
			)
			.max(50, "O pedido deve ter no máximo 50 itens")
			.default([]),
		combos: comboOrderInputSchema,
		scheduledAt: z.iso.datetime("Data de agendamento inválida").nullish()
	})
	.superRefine((data, ctx) => {
		if (data.items.length === 0 && data.combos.length === 0) {
			ctx.addIssue({
				path: ["items"],
				code: "custom",
				message: "O pedido deve ter ao menos um item ou combo"
			});
		}

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
			if (!data.districtId) {
				ctx.addIssue({
					path: ["districtId"],
					code: "custom",
					message: "O bairro deve ser preenchido"
				});
			}

			if (!data.address) {
				ctx.addIssue({
					path: ["address"],
					code: "custom",
					message: "O endereço deve ser preenchido"
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

export const quoteOrderBodySchema = z.object({
	establishmentId: z.ulid("O id do estabelecimento deve ser preenchido"),
	customerPhone: phoneSchema.optional().nullable(),
	deliveryType: z.enum(DeliveryType, "O tipo de entrega deve ser preenchido"),
	districtId: z.ulid("O bairro deve ser preenchido").optional().nullable(),
	couponId: z.ulid("O cupom deve ser preenchido").optional().nullable(),
	items: z
		.array(
			z.object({
				id: z.string("O id deve ser preenchido").min(1, "O id deve ser preenchido"),
				quantity: z
					.number("A quantidade deve ser preenchida")
					.int("A quantidade deve ser um número inteiro")
					.min(1, "A quantidade deve ser maior que zero"),
				weightGrams: z.coerce
					.number()
					.int("O peso deve ser um número inteiro de gramas")
					.min(1, "O peso deve ser maior que zero")
					.optional()
					.nullable(),
				addonCategories: z
					.array(
						z.object({
							id: z.coerce.number().int().min(1),
							addons: z.array(
								z.object({
									id: z.coerce.number().int().min(1),
									quantity: z.coerce.number().int().min(1).default(1)
								})
							)
						})
					)
					.max(20)
					.optional()
					.nullable()
			})
		)
		.max(50, "O pedido deve ter no máximo 50 itens")
		.default([]),
	combos: comboOrderInputSchema
});

z.globalRegistry.add(quoteOrderBodySchema, { id: "QuoteOrderBody" });

export const updateOrderStatusBodySchema = z.object({
	status: z.enum(OrderStatusType, "O status do pedido deve ser preenchido")
});

z.globalRegistry.add(updateOrderStatusBodySchema, {
	id: "UpdateOrderStatusBody"
});

export const orderParamsSchema = z.object({
	id: z.ulid().min(1, "O id do pedido deve ser preenchido")
});

export const listOrdersQueryParamsSchema = listQueryParamsSchema.extend({
	dateStart: z.iso.date("Data inicial inválida").optional(),
	dateEnd: z.iso.date("Data final inválida").optional(),
	includeScheduled: z
		.enum(["true", "false"])
		.optional()
		.transform(value => value === "true")
});
