import { forgetAllListingCacheKeysEvent } from "@/events/forget-listing-cache-keys-event.ts";
import { BannerLinkType } from "@/generated/prisma/client.ts";
import type { IBannerRepository } from "@/interfaces/repositories/banner-repository.ts";
import { updateBannerBodySchema } from "@/schemas/banner-schema.ts";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.ts";
import z from "zod";

interface UpdateBannerServiceRequest
	extends
		z.infer<typeof updateBannerBodySchema>,
		Pick<ForgetAllListingCacheKeysParams, "paramsToForget"> {
	id: number;
}

export class UpdateBannerService {
	private bannerRepository: IBannerRepository;

	constructor(bannerRepository: IBannerRepository) {
		this.bannerRepository = bannerRepository;
	}

	async handle({
		id,
		establishmentId,
		categoryId,
		productId,
		linkType: link_type,
		paramsToForget,
		...data
	}: UpdateBannerServiceRequest) {
		await this.bannerRepository.update({
			id,
			data: {
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
			}
		});

		forgetAllListingCacheKeysEvent.emit("forget-all-listing-cache-keys", {
			baseCacheKey: "addresses",
			paramsToForget
		});
	}
}
