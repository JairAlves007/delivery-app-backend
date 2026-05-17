import z from "zod";

import { ProductPricingMode } from "@/generated/prisma/client.js";
import { transformPriceToDatabase } from "@/helpers/price.js";

const createProductBodyBaseSchema = z.object({
  name: z.string().trim().min(1, "O nome deve ser preenchido").max(255),
  description: z
    .string()
    .trim()
    .min(1, "A descrição deve ser preenchida")
    .max(2000, "A descrição deve ter no máximo 2000 caracteres"),
  price: z.coerce
    .number("O preço deve ser preenchido")
    .min(0, "O preço deve ser maior ou igual a zero")
    .transform((val) => transformPriceToDatabase(val)),
  pricingMode: z
    .enum(ProductPricingMode, "Modo de preço inválido")
    .default(ProductPricingMode.UNIT),
  pricePer100g: z.coerce
    .number()
    .min(0, "O preço por 100g deve ser maior ou igual a zero")
    .transform((val) => transformPriceToDatabase(val))
    .nullable()
    .optional(),
  tagIds: z.array(z.coerce.number().int().positive()),
  bannerIds: z.array(z.string()).optional(),
  discountPercentage: z
    .number("O desconto deve ser preenchido")
    .min(0, "O desconto deve ser maior ou igual a zero")
    .nullable()
    .optional(),
  stock: z
    .number("O estoque deve ser preenchido")
    .int("O estoque deve ser um número inteiro")
    .min(0, "O estoque deve ser maior ou igual a zero")
    .optional(),
  validUntil: z.coerce
    .date("A data de validade deve ser preenchida")
    .refine((val) => val >= new Date(), "A data de validade deve ser futura")
    .optional(),
  categoryId: z
    .ulid("O id da categoria deve ser preenchido corretamente")
    .min(1, "O id da categoria deve ser preenchido"),
  addonCategoryAttachments: z
    .array(
      z.object({
        addonCategoryId: z.coerce
          .number("O id da categoria de adicional deve ser preenchido")
          .int()
          .min(1, "O id da categoria de adicional deve ser maior que zero"),
        displayOrder: z.coerce
          .number()
          .int("A ordem de exibição deve ser inteira")
          .min(0)
          .default(0),
        isRequired: z.boolean().default(false),
        minSelection: z.coerce
          .number()
          .int("A seleção mínima deve ser inteira")
          .min(0, "A seleção mínima deve ser maior ou igual a zero")
          .nullable()
          .optional(),
        maxSelection: z.coerce
          .number()
          .int("A seleção máxima deve ser inteira")
          .min(1, "A seleção máxima deve ser maior ou igual a 1")
          .nullable()
          .optional(),
      }).refine(
        (data) => {
          if (
            data.minSelection != null &&
            data.maxSelection != null &&
            data.minSelection > data.maxSelection
          ) {
            return false;
          }
          if (data.isRequired && (data.minSelection == null || data.minSelection < 1)) {
            return false;
          }
          return true;
        },
        {
          message:
            "minSelection não pode ser maior que maxSelection. Quando isRequired=true, minSelection deve ser >= 1",
        },
      ),
    )
    .optional(),
});

const validateProductCoherence = (
  data: {
    discountPercentage?: number | null;
    pricingMode?: ProductPricingMode;
    pricePer100g?: number | null;
  },
  ctx: z.RefinementCtx,
) => {
  if (data.discountPercentage && data.discountPercentage > 100) {
    ctx.addIssue({
      path: ["discountPercentage"],
      code: "too_big",
      maximum: 100,
      type: "number",
      inclusive: true,
      origin: "number",
      message: "O valor percentual não pode ser maior que 100",
    });
  }
  if (
    data.pricingMode === ProductPricingMode.PER_WEIGHT &&
    (data.pricePer100g == null || data.pricePer100g <= 0)
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["pricePer100g"],
      message:
        "pricePer100g é obrigatório (>0) quando pricingMode é PER_WEIGHT",
    });
  }
  if (
    data.pricingMode === ProductPricingMode.UNIT &&
    data.pricePer100g != null
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["pricePer100g"],
      message: "pricePer100g só pode ser definido para pricingMode PER_WEIGHT",
    });
  }
};

export const createProductBodySchema = createProductBodyBaseSchema.superRefine(
  validateProductCoherence,
);

z.globalRegistry.add(createProductBodySchema, { id: "CreateProductBody" });

export const updateProductBodySchema = createProductBodyBaseSchema
  .partial()
  .superRefine(validateProductCoherence);

z.globalRegistry.add(updateProductBodySchema, { id: "UpdateProductBody" });

export const productParamsSchema = z.object({
  id: z.ulid().min(1, "O id do produto deve ser preenchido"),
});
