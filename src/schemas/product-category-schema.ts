import z from "zod";

export const createProductCategoryBodySchema = z.object({
  name: z.string().trim().min(1, "O nome deve ser preenchido").max(255),
  order: z.coerce
    .number()
    .int("A ordem deve ser um número inteiro")
    .min(0, "A ordem deve ser maior ou igual a zero")
    .optional()
    .nullable(),
  bannerIds: z.array(z.coerce.number().int().positive()).optional(),
});

export const updateProductCategoryBodySchema =
  createProductCategoryBodySchema.partial();

z.globalRegistry.add(updateProductCategoryBodySchema, {
  id: "UpdateProductCategoryBody",
});

export const productCategoryParamsSchema = z.object({
  id: z.ulid().min(1, "O id da categoria deve ser preenchido"),
});
