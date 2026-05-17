import z from "zod";

import { AddonPricingStrategy, AddonType } from "@/generated/prisma/client.js";

const addonCategoryBaseShape = {
  name: z.string().trim().min(1, "O nome deve ser preenchido").max(255),
  type: z.enum(AddonType, "Tipo de categoria do adicional inválido"),
  pricingStrategy: z
    .enum(AddonPricingStrategy, "Estratégia de preço inválida")
    .default(AddonPricingStrategy.SUM),
  partsCount: z.coerce
    .number()
    .int("O número de partes deve ser inteiro")
    .min(2, "O número de partes deve ser maior ou igual a 2")
    .max(10, "O número de partes deve ser menor ou igual a 10")
    .nullable()
    .optional(),
};

const validateCoherence = (
  data: {
    type?: AddonType;
    pricingStrategy?: AddonPricingStrategy;
    partsCount?: number | null;
  },
  ctx: z.RefinementCtx,
) => {
  if (data.type === AddonType.FRACTIONAL && data.partsCount == null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["partsCount"],
      message: "partsCount é obrigatório para categorias FRACTIONAL",
    });
  }
  if (data.type !== AddonType.FRACTIONAL && data.partsCount != null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["partsCount"],
      message: "partsCount só pode ser definido para categorias FRACTIONAL",
    });
  }
  if (
    data.type === AddonType.SINGLE_CHOICE &&
    data.pricingStrategy != null &&
    data.pricingStrategy !== AddonPricingStrategy.SUM &&
    data.pricingStrategy !== AddonPricingStrategy.NONE
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["pricingStrategy"],
      message: "SINGLE_CHOICE aceita apenas estratégias SUM ou NONE",
    });
  }
};

export const createAddonCategoryBodySchema = z
  .object(addonCategoryBaseShape)
  .superRefine(validateCoherence);

z.globalRegistry.add(createAddonCategoryBodySchema, {
  id: "CreateAddonCategoryBody",
});

export const updateAddonCategoryBodySchema = z
  .object({
    name: addonCategoryBaseShape.name.optional(),
    type: addonCategoryBaseShape.type.optional(),
    pricingStrategy: addonCategoryBaseShape.pricingStrategy.optional(),
    partsCount: addonCategoryBaseShape.partsCount,
    addonIds: z.array(z.coerce.number().int().positive()).optional(),
    status: z.boolean("Precisamos saber se o adicional está ativo"),
  })
  .superRefine(validateCoherence);

z.globalRegistry.add(updateAddonCategoryBodySchema, {
  id: "UpdateAddonCategoryBody",
});

export const addonCategoryParamsSchema = z.object({
  id: z.coerce
    .number("O id deve ser preenchido")
    .int()
    .min(1, "O id deve ser maior que zero"),
});
