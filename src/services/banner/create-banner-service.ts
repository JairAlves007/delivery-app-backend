import type { IBannerRepository } from "@/interfaces/repositories/banner-repository.ts";
import { createBannerBodySchema } from "@/schemas/banner-schema.ts";
import { BannerLinkType } from "@prisma/client";
import z from "zod";

type CreateBannerServiceRequest = z.infer<typeof createBannerBodySchema>;

export class CreateBannerService {
	private bannerRepository: IBannerRepository;

	constructor(bannerRepository: IBannerRepository) {
		this.bannerRepository = bannerRepository;
	}

	async handle({
		establishmentId,
		categoryId,
		productId,
		linkType: link_type,
		...data
	}: CreateBannerServiceRequest) {
		return await this.bannerRepository.create({
			...data,
			link_type,
			establishment: {
				connect: {
					id: establishmentId
				}
			},
			...(!!categoryId &&
				link_type === BannerLinkType.CATEGORY && {
					category: {
						connect: { id: categoryId }
					}
				}),
			...(!!productId &&
				link_type === BannerLinkType.PRODUCT && {
					product: {
						connect: { id: productId }
					}
				})
		});
	}
}
