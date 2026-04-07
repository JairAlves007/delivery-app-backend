import z from "zod";

import { CouponType, DiscountType } from "@/generated/prisma/client.js";

import { establishmentIdSchema } from "./generic-schema.js";

const createCouponBodyBaseSchema = z.object({
	type: z.enum(CouponType, "Tipo de cupom inválido"),
	value: z.coerce.number().positive("O valor deve ser maior que zero"),
	code: z
		.string()
		.trim()
		.min(1, "O código deve ser preenchido")
		.max(50, "O código deve ter no máximo 50 caracteres")
		.transform(val => val.toUpperCase()),
	discountType: z.enum(DiscountType, "Tipo de desconto inválido"),
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
		.int("O uso máximo deve ser um número inteiro")
		.min(1, "O uso máximo deve ser maior que zero")
		.nullable(),
	usesPerUser: z.coerce
		.number()
		.int("O uso por usuário deve ser um número inteiro")
		.min(1, "O uso por usuário deve ser maior que zero")
		.nullable(),
	establishmentId: establishmentIdSchema
});

export const createCouponBodySchema = createCouponBodyBaseSchema.superRefine(
	(data, ctx) => {
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
	}
);

z.globalRegistry.add(createCouponBodySchema, { id: "CreateCouponBody" });

export const updateCouponBodySchema = createCouponBodyBaseSchema
	.partial()
	.extend({
		establishmentId: createCouponBodyBaseSchema.shape.establishmentId
	});

z.globalRegistry.add(updateCouponBodySchema, { id: "UpdateCouponBody" });

export const checkCouponBodySchema = z.object({
	code: z
		.string()
		.trim()
		.min(1, "O código deve ser preenchido")
		.max(50, "O código deve ter no máximo 50 caracteres")
		.transform(val => val.toUpperCase()),
	establishmentId: establishmentIdSchema
});

z.globalRegistry.add(checkCouponBodySchema, { id: "CheckCouponBody" });

export const couponParamsSchema = z.object({
	id: z.coerce
		.number("O id deve ser preenchido")
		.int()
		.min(1, "O id deve ser maior que zero")
});
