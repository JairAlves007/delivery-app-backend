import z from "zod";

import { BannerLinkType } from "@/generated/prisma/client.js";

const createBannerBodyBaseSchema = z.object({
  name: z.string().trim().min(1, "O nome deve ser preenchido").max(255),
  linkType: z.enum(BannerLinkType, "Tipo de link inválido"),
  productId: z.ulid("ID do produto inválido").nullable().optional(),
  categoryId: z.ulid("ID da categoria inválido").nullable().optional(),
});

export const createBannerBodySchema = createBannerBodyBaseSchema.superRefine(
  (data, ctx) => {
    if (data.linkType === BannerLinkType.PRODUCT && !data.productId) {
      ctx.addIssue({
        path: ["productId"],
        code: "custom",
        message: `ID do produto é obrigatório quando linkType = ${BannerLinkType.PRODUCT}`,
      });
    }

    if (data.linkType === BannerLinkType.CATEGORY && !data.categoryId) {
      ctx.addIssue({
        path: ["categoryId"],
        code: "custom",
        message: `ID da categoria é obrigatório quando linkType = ${BannerLinkType.CATEGORY}`,
      });
    }
  },
);

z.globalRegistry.add(createBannerBodySchema, { id: "CreateBannerBody" });

export const updateBannerBodySchema = createBannerBodyBaseSchema.partial();

z.globalRegistry.add(updateBannerBodySchema, { id: "UpdateBannerBody" });

export const bannerParamsSchema = z.object({
  id: z.ulid("ID do banner inválido"),
});
