import {
	DeliveryType,
	OrderStatusType,
	PaymentMethodType
} from "@prisma/client";
import z from "zod";
import { establishmentIdSchema } from "./generic-schema.ts";

export const createOrderBodySchema = z
	.object({
		establishmentId: establishmentIdSchema,
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
			.min(1, "O cupom deve ser preenchido")
			.optional()
			.nullable(),
		comment: z
			.string("O comentário deve ser preenchido")
			.min(1, "O comentário deve ser preenchido")
			.optional()
			.nullable(),
		paymentMethod: z
			.string()
			.enumCaseInsensitive(
				PaymentMethodType,
				"O método de pagamento deve ser preenchido"
			),
		deliveryType: z
			.string()
			.enumCaseInsensitive(
				DeliveryType,
				"O tipo de entrega deve ser preenchido"
			),
		changeAmount: z.coerce
			.number()
			.min(0, "O troco deve ser maior que zero")
			.optional()
			.nullable(),
		items: z.array(
			z.object({
				id: z
					.string("O id deve ser preenchido")
					.min(1, "O id deve ser maior que zero"),
				quantity: z
					.number("A quantidade deve ser preenchida")
					.min(1, "A quantidade deve ser maior que zero"),
				addonCategories: z
					.array(
						z.object({
							id: z.coerce
								.number("O id deve ser preenchido")
								.min(1, "O id deve ser maior que zero"),
							addons: z.array(
								z.object({
									id: z.coerce
										.number("O id deve ser preenchido")
										.min(1, "O id deve ser maior que zero"),
									quantity: z
										.number("A quantidade deve ser preenchida")
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
	})
	.superRefine((data, ctx) => {
		if (
			data.paymentMethod === PaymentMethodType.MONEY &&
			(data.changeAmount === undefined ||
				data.changeAmount === null ||
				data.changeAmount <= 0)
		) {
			ctx.addIssue({
				path: ["changeAmount"],
				code: "custom",
				message: "O troco deve ser preenchido"
			});
		}

		if (data.deliveryType === DeliveryType.DELIVERY) {
			if (!!!data.addressId) {
				ctx.addIssue({
					path: ["addressId"],
					code: "custom",
					message: "O endereço deve ser preenchido"
				});
			}

			if (!!!data.districtId) {
				ctx.addIssue({
					path: ["districtId"],
					code: "custom",
					message: "O bairro deve ser preenchido"
				});
			}
		}
	});

export const updateOrderBodySchema = z.object({
	status: z
		.string()
		.enumCaseInsensitive(
			OrderStatusType,
			"O status do pedido deve ser preenchido"
		)
});

export const orderParamsSchema = z.object({
	id: z.ulid().min(1, "O id do pedido deve ser preenchido")
});
