import z from "zod";

import { ComboType } from "@/generated/prisma/client.js";

const comboItemSchema = z.object({
  productId: z.ulid("Produto inválido"),
  quantity: z.coerce
    .number("A quantidade deve ser preenchida")
    .int()
    .min(1, "A quantidade deve ser maior que zero"),
});

const comboGroupOptionSchema = z.object({
  productId: z.ulid("Produto inválido"),
  additionalPrice: z.coerce
    .number()
    .min(0, "O preço adicional não pode ser negativo")
    .default(0),
});

const comboGroupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "O nome do grupo deve ser preenchido")
      .max(255, "O nome do grupo deve ter no máximo 255 caracteres"),
    minSelection: z.coerce
      .number()
      .int()
      .min(0, "A seleção mínima não pode ser negativa"),
    maxSelection: z.coerce
      .number()
      .int()
      .min(1, "A seleção máxima deve ser maior que zero"),
    displayOrder: z.coerce.number().int().min(0).default(0),
    options: z
      .array(comboGroupOptionSchema)
      .min(1, "O grupo deve ter ao menos uma opção"),
  })
  .refine((group) => group.minSelection <= group.maxSelection, {
    path: ["minSelection"],
    message: "A seleção mínima não pode ser maior que a máxima",
  })
  .refine((group) => group.maxSelection <= group.options.length, {
    path: ["maxSelection"],
    message: "A seleção máxima não pode exceder o número de opções",
  });

const createComboBodyBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "O nome deve ser preenchido")
    .max(255, "O nome deve ter no máximo 255 caracteres"),
  description: z
    .string()
    .trim()
    .max(2000, "A descrição deve ter no máximo 2000 caracteres")
    .nullable()
    .default(null),
  comboType: z.enum(ComboType, "Tipo de combo inválido"),
  price: z.coerce.number().positive("O preço deve ser maior que zero"),
  discountPercentage: z.coerce
    .number()
    .min(0, "O desconto não pode ser negativo")
    .max(100, "O desconto não pode ser maior que 100")
    .nullable()
    .default(null),
  isActive: z.coerce.boolean().default(true),
  validUntil: z.coerce.date("Data inválida").nullable().default(null),
  order: z.coerce.number().int().min(0).nullable().default(null),
  resourceId: z.ulid("Imagem inválida").nullable().default(null),
  items: z.array(comboItemSchema).default([]),
  groups: z.array(comboGroupSchema).default([]),
});

export const createComboBodySchema = createComboBodyBaseSchema.superRefine(
  (data, ctx) => {
    if (data.comboType === ComboType.FIXED && data.items.length === 0)
      ctx.addIssue({
        path: ["items"],
        code: "custom",
        message: "Um combo fixo deve ter ao menos um item",
      });

    if (
      data.comboType === ComboType.BUILD_YOUR_OWN &&
      data.groups.length === 0
    )
      ctx.addIssue({
        path: ["groups"],
        code: "custom",
        message: "Um combo montável deve ter ao menos um grupo",
      });
  },
);

z.globalRegistry.add(createComboBodySchema, { id: "CreateComboBody" });

export const updateComboBodySchema = createComboBodyBaseSchema.partial();

z.globalRegistry.add(updateComboBodySchema, { id: "UpdateComboBody" });

export const comboParamsSchema = z.object({
  id: z.ulid("O id deve ser preenchido"),
});
