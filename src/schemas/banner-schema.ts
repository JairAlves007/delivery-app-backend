import { BannerLinkType } from "@/generated/prisma/client.ts";
import z from "zod";
import { establishmentIdSchema } from "./generic-schema.ts";

export const createBannerBodySchema = z
	.object({
		name: z.string().min(1, "O nome deve ser preenchido"),
		linkType: z
			.string()
			.enumCaseInsensitive(BannerLinkType, "Tipo de link inválido"),
		productId: z.ulid("ID do produto inválido").nullable().optional(),
		categoryId: z.ulid("ID da categoria inválido").nullable().optional(),
		establishmentId: establishmentIdSchema
	})
	.superRefine((data, ctx) => {
		if (data.linkType === BannerLinkType.PRODUCT && !data.productId) {
			ctx.addIssue({
				path: ["productId"],
				code: "custom",
				message: `ID do produto é obrigatório quando linkType = ${BannerLinkType.PRODUCT}`
			});
		}

		if (data.linkType === BannerLinkType.CATEGORY && !data.categoryId) {
			ctx.addIssue({
				path: ["categoryId"],
				code: "custom",
				message: `ID da categoria é obrigatório quando linkType = ${BannerLinkType.CATEGORY}`
			});
		}
	});

export const updateBannerBodySchema = createBannerBodySchema.partial().extend({
	establishmentId: createBannerBodySchema.shape.establishmentId
});

export const bannerParamsSchema = z.object({
	id: z.coerce
		.number("O id deve ser preenchido")
		.min(1, "O id deve ser maior que zero")
});
