import { CouponType, DiscountType } from "@/generated/prisma/client.ts";
import z from "zod";
import { establishmentIdSchema } from "./generic-schema.ts";

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
		startsAt: z.coerce
			.date("A data de inicio deve ser preenchida")
			.refine(val => val >= new Date(), "A data de inicio deve ser futura")
			.nullable(),
		endsAt: z.coerce
			.date("A data de fim deve ser preenchida")
			.refine(val => val >= new Date(), "A data de fim deve ser futura")
			.nullable(),
		maxUses: z.coerce
			.number()
			.min(1, "O uso máximo deve ser maior que zero")
			.nullable(),
		usesPerUser: z.coerce
			.number()
			.min(1, "O uso por usuário deve ser maior que zero")
			.nullable(),
		establishmentId: establishmentIdSchema
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

		if (data.startsAt && data.endsAt) {
			if (data.startsAt >= data.endsAt) {
				ctx.addIssue({
					path: ["startsAt"],
					code: "custom",
					message: "A data de início deve ser menor que a data de fim"
				});
			}

			if (data.endsAt <= data.startsAt) {
				ctx.addIssue({
					path: ["endsAt"],
					code: "custom",
					message: "A data de fim deve ser maior que a data de início"
				});
			}
		}
	});

export const updateCouponBodySchema = createCouponBodySchema.partial().extend({
	establishmentId: createCouponBodySchema.shape.establishmentId
});

export const checkCouponBodySchema = z.object({
	code: z
		.string()
		.min(1, "O código deve ser preenchido")
		.transform(val => val.toUpperCase()),
	establishmentId: establishmentIdSchema
});

export const couponParamsSchema = z.object({
	id: z.coerce
		.number("O id deve ser preenchido")
		.min(1, "O id deve ser maior que zero")
});
