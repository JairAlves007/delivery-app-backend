import z from "zod";

import {
  CouponScopeType,
  DiscountType,
  PromotionType,
  WeekDay,
} from "@/generated/prisma/client.js";

const timeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Horário inválido (use HH:MM)");

const promotionWindowSchema = z.object({
  dayOfWeek: z.enum(WeekDay, "Dia da semana inválido"),
  opensAt: timeSchema,
  closesAt: timeSchema,
});

const createPromotionBodyBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "O nome deve ser preenchido")
    .max(255, "O nome deve ter no máximo 255 caracteres"),
  type: z.enum(PromotionType, "Tipo de promoção inválido"),
  discountType: z.enum(DiscountType, "Tipo de desconto inválido").nullable().default(null),
  value: z.coerce
    .number()
    .positive("O valor deve ser maior que zero")
    .nullable()
    .default(null),
  scope: z
    .enum(CouponScopeType, "Escopo inválido")
    .default(CouponScopeType.ALL),
  minOrderValue: z.coerce
    .number()
    .min(0, "O valor mínimo não pode ser negativo")
    .nullable()
    .default(null),
  buyQuantity: z.coerce
    .number()
    .int("A quantidade deve ser um número inteiro")
    .min(1, "A quantidade deve ser maior que zero")
    .nullable()
    .default(null),
  payQuantity: z.coerce
    .number()
    .int("A quantidade deve ser um número inteiro")
    .min(0, "A quantidade não pode ser negativa")
    .nullable()
    .default(null),
  priority: z.coerce.number().int().min(0).default(0),
  stackableWithCoupon: z.coerce.boolean().default(false),
  isActive: z.coerce.boolean().default(true),
  startsAt: z.coerce.date("A data de início é inválida").nullable().default(null),
  endsAt: z.coerce.date("A data de fim é inválida").nullable().default(null),
  productIds: z.array(z.ulid("Produto inválido")).default([]),
  categoryIds: z.array(z.ulid("Categoria inválida")).default([]),
  windows: z.array(promotionWindowSchema).default([]),
});

export const createPromotionBodySchema =
  createPromotionBodyBaseSchema.superRefine((data, ctx) => {
    const requiresDiscount =
      data.type === PromotionType.MIN_ORDER_DISCOUNT ||
      data.type === PromotionType.HAPPY_HOUR;

    if (requiresDiscount) {
      if (data.discountType == null)
        ctx.addIssue({
          path: ["discountType"],
          code: "custom",
          message: "O tipo de desconto é obrigatório para esta promoção",
        });
      if (data.value == null)
        ctx.addIssue({
          path: ["value"],
          code: "custom",
          message: "O valor é obrigatório para esta promoção",
        });
      if (
        data.discountType === DiscountType.PERCENTAGE &&
        data.value != null &&
        data.value > 100
      )
        ctx.addIssue({
          path: ["value"],
          code: "custom",
          message: "O valor percentual não pode ser maior que 100",
        });
    }

    if (
      data.type === PromotionType.HAPPY_HOUR &&
      data.windows.length === 0
    )
      ctx.addIssue({
        path: ["windows"],
        code: "custom",
        message: "Defina ao menos uma janela de horário para o happy hour",
      });

    if (data.type === PromotionType.BUY_X_PAY_Y) {
      if (data.buyQuantity == null || data.payQuantity == null) {
        ctx.addIssue({
          path: ["buyQuantity"],
          code: "custom",
          message: "Informe as quantidades de leve e pague",
        });
      } else if (data.buyQuantity <= data.payQuantity) {
        ctx.addIssue({
          path: ["buyQuantity"],
          code: "custom",
          message: "A quantidade de 'leve' deve ser maior que a de 'pague'",
        });
      }
    }

    if (
      (data.type === PromotionType.MIN_ORDER_DISCOUNT ||
        data.type === PromotionType.FREE_SHIPPING_THRESHOLD) &&
      data.minOrderValue == null
    )
      ctx.addIssue({
        path: ["minOrderValue"],
        code: "custom",
        message: "O valor mínimo é obrigatório para esta promoção",
      });

    if (data.scope === CouponScopeType.PRODUCTS && data.productIds.length === 0)
      ctx.addIssue({
        path: ["productIds"],
        code: "custom",
        message: "Selecione ao menos um produto para o escopo",
      });

    if (
      data.scope === CouponScopeType.CATEGORIES &&
      data.categoryIds.length === 0
    )
      ctx.addIssue({
        path: ["categoryIds"],
        code: "custom",
        message: "Selecione ao menos uma categoria para o escopo",
      });

    if (data.startsAt && data.endsAt && data.startsAt >= data.endsAt)
      ctx.addIssue({
        path: ["endsAt"],
        code: "custom",
        message: "A data de fim deve ser maior que a data de início",
      });
  });

z.globalRegistry.add(createPromotionBodySchema, { id: "CreatePromotionBody" });

export const updatePromotionBodySchema =
  createPromotionBodyBaseSchema.partial();

z.globalRegistry.add(updatePromotionBodySchema, { id: "UpdatePromotionBody" });

export const promotionParamsSchema = z.object({
  id: z.ulid("O id deve ser preenchido"),
});
