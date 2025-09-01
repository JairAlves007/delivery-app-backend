import { BannerLinkType } from "@prisma/client";
import z from "zod";

export const createBannerBodySchema = z
	.object({
		name: z.string().min(1, "O nome deve ser preenchido"),
		image_key: z.string().min(1, "Precisamos da chave da imagem"),
		linkType: z
			.string()
			.enumCaseInsensitive(BannerLinkType, "Tipo de link inválido"),
		productId: z.string().nullable().optional(),
		categoryId: z.string().nullable().optional(),
		establishmentId: z
			.string()
			.min(1, "O id do estabelecimento deve ser preenchido")
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
