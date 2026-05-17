import z from "zod";

const baseShape = {
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
};

const validateRange = (
  data: {
    minSelection?: number | null;
    maxSelection?: number | null;
    isRequired?: boolean;
  },
  ctx: z.RefinementCtx,
) => {
  if (
    data.minSelection != null &&
    data.maxSelection != null &&
    data.minSelection > data.maxSelection
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["minSelection"],
      message: "A seleção mínima não pode ser maior que a seleção máxima",
    });
  }
  if (data.isRequired && (data.minSelection == null || data.minSelection < 1)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["minSelection"],
      message:
        "Quando isRequired=true, minSelection deve ser maior ou igual a 1",
    });
  }
};

export const attachProductAddonCategoryBodySchema = z
  .object(baseShape)
  .superRefine(validateRange);

z.globalRegistry.add(attachProductAddonCategoryBodySchema, {
  id: "AttachProductAddonCategoryBody",
});

export const updateProductAddonCategoryBodySchema = z
  .object({
    displayOrder: baseShape.displayOrder.optional(),
    isRequired: baseShape.isRequired.optional(),
    minSelection: baseShape.minSelection,
    maxSelection: baseShape.maxSelection,
  })
  .superRefine(validateRange);

z.globalRegistry.add(updateProductAddonCategoryBodySchema, {
  id: "UpdateProductAddonCategoryBody",
});

export const productAddonCategoryParamsSchema = z.object({
  productId: z.ulid().min(1, "O id do produto deve ser preenchido"),
  categoryId: z.coerce
    .number("O id da categoria deve ser preenchido")
    .int()
    .min(1, "O id da categoria deve ser maior que zero"),
});

export const productIdParamsSchema = z.object({
  productId: z.ulid().min(1, "O id do produto deve ser preenchido"),
});
