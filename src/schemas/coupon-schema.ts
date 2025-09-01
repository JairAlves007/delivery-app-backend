import { CouponType, DiscountType } from "@prisma/client";
import z from "zod";

export const createCouponBodySchema = z
	.object({
		type: z.string().enumCaseInsensitive(CouponType, "Tipo de cupom inválido"),
		value: z.coerce.number().min(1, "O valor deve ser maior que zero"),
		code: z
			.string()
			.min(1, "O código deve ser preenchido")
			.transform(val => val.toUpperCase()),
		discountType: z
			.string()
			.enumCaseInsensitive(DiscountType, "Tipo de desconto inválido"),
		startsAt: z.date("A data de inicio deve ser preenchida").nullable(),
		endsAt: z.date("A data de fim deve ser preenchida").nullable(),
		maxUses: z.coerce
			.number()
			.min(1, "O uso máximo deve ser maior que zero")
			.nullable(),
		usesPerUser: z.coerce
			.number()
			.min(1, "O uso por usuário deve ser maior que zero")
			.nullable(),
		establishmentId: z
			.string()
			.min(1, "O id do estabelecimento deve ser preenchido")
	})
	.superRefine((data, ctx) => {
		if (data.discountType === DiscountType.PERCENTAGE && data.value > 100) {
			ctx.addIssue({
				path: ["value"],
				code: "too_big",
				maximum: 100,
				type: "number",
				inclusive: true,
				origin: "number",
				message: "O valor percentual não pode ser maior que 100"
			});
		}
	});

export const updateCouponBodySchema = createCouponBodySchema.partial().extend({
	establishmentId: createCouponBodySchema.shape.establishmentId
});

export const couponParamsSchema = z.object({
	id: z.coerce
		.number("O id deve ser preenchido")
		.min(1, "O id deve ser maior que zero")
});
