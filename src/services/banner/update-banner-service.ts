import type { IBannerRepository } from "@/interfaces/repositories/banner-repository.ts";
import { updateBannerBodySchema } from "@/schemas/banner-schema.ts";
import { BannerLinkType } from "@prisma/client";
import z from "zod";

type UpdateBannerServiceRequest = z.infer<typeof updateBannerBodySchema>;

export class UpdateBannerService {
	private bannerRepository: IBannerRepository;

	constructor(bannerRepository: IBannerRepository) {
		this.bannerRepository = bannerRepository;
	}

	async handle(
		id: number,
		{
			establishmentId,
			categoryId,
			productId,
			linkType: link_type,
			...data
		}: UpdateBannerServiceRequest
	) {
		return await this.bannerRepository.update(id, {
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
