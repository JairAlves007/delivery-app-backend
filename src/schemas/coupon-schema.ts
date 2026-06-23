import z from "zod";

import {
  CouponScopeType,
  CouponType,
  DiscountType,
} from "@/generated/prisma/client.js";
import { phoneSchema } from "@/schemas/generic-schema.js";

const createCouponBodyBaseSchema = z.object({
  type: z.enum(CouponType, "Tipo de cupom inválido"),
  value: z.coerce.number().positive("O valor deve ser maior que zero"),
  code: z
    .string()
    .trim()
    .min(1, "O código deve ser preenchido")
    .max(50, "O código deve ter no máximo 50 caracteres")
    .transform((val) => val.toUpperCase()),
  discountType: z.enum(DiscountType, "Tipo de desconto inválido"),
  scope: z.enum(CouponScopeType, "Escopo inválido").default(CouponScopeType.ALL),
  minOrderValue: z.coerce
    .number()
    .min(0, "O valor mínimo não pode ser negativo")
    .nullable()
    .default(null),
  perCustomerLimit: z.coerce
    .number()
    .int("O limite por cliente deve ser um número inteiro")
    .min(1, "O limite por cliente deve ser maior que zero")
    .nullable()
    .default(null),
  isActive: z.coerce.boolean().default(true),
  productIds: z.array(z.ulid("Produto inválido")).default([]),
  categoryIds: z.array(z.ulid("Categoria inválida")).default([]),
  startsAt: z.coerce
    .date("A data de inicio deve ser preenchida")
    .refine((val) => val >= new Date(), "A data de inicio deve ser futura")
    .nullable(),
  endsAt: z.coerce
    .date("A data de fim deve ser preenchida")
    .refine((val) => val >= new Date(), "A data de fim deve ser futura")
    .nullable(),
  maxUses: z.coerce
    .number()
    .int("O uso máximo deve ser um número inteiro")
    .min(1, "O uso máximo deve ser maior que zero")
    .nullable(),
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
        message: "O valor percentual não pode ser maior que 100",
      });
    }

    if (
      data.scope === CouponScopeType.PRODUCTS &&
      data.productIds.length === 0
    ) {
      ctx.addIssue({
        path: ["productIds"],
        code: "custom",
        message: "Selecione ao menos um produto para o escopo do cupom",
      });
    }

    if (
      data.scope === CouponScopeType.CATEGORIES &&
      data.categoryIds.length === 0
    ) {
      ctx.addIssue({
        path: ["categoryIds"],
        code: "custom",
        message: "Selecione ao menos uma categoria para o escopo do cupom",
      });
    }

    if (data.startsAt && data.endsAt) {
      if (data.startsAt >= data.endsAt) {
        ctx.addIssue({
          path: ["startsAt"],
          code: "custom",
          message: "A data de início deve ser menor que a data de fim",
        });
      }

      if (data.endsAt <= data.startsAt) {
        ctx.addIssue({
          path: ["endsAt"],
          code: "custom",
          message: "A data de fim deve ser maior que a data de início",
        });
      }
    }
  },
);

z.globalRegistry.add(createCouponBodySchema, { id: "CreateCouponBody" });

export const updateCouponBodySchema = createCouponBodyBaseSchema.partial();

z.globalRegistry.add(updateCouponBodySchema, { id: "UpdateCouponBody" });

export const checkCouponBodySchema = z.object({
  establishmentId: z.ulid("O id do estabelecimento deve ser preenchido"),
  code: z
    .string()
    .trim()
    .min(1, "O código deve ser preenchido")
    .max(50, "O código deve ter no máximo 50 caracteres")
    .transform((val) => val.toUpperCase()),
  customerPhone: phoneSchema.optional(),
  subtotal: z.coerce
    .number()
    .min(0, "O subtotal não pode ser negativo")
    .optional(),
});

z.globalRegistry.add(checkCouponBodySchema, { id: "CheckCouponBody" });

export const couponParamsSchema = z.object({
  id: z.ulid("O id deve ser preenchido"),
});
