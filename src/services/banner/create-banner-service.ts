import { forgetAllListingCacheKeysEvent } from "@/events/forget-listing-cache-keys-event.ts";
import { BannerLinkType } from "@/generated/prisma/client.ts";
import type { IBannerRepository } from "@/interfaces/repositories/banner-repository.ts";
import { createBannerBodySchema } from "@/schemas/banner-schema.ts";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.ts";
import z from "zod";

type CreateBannerServiceRequest = z.infer<typeof createBannerBodySchema> &
	Pick<ForgetAllListingCacheKeysParams, "paramsToForget">;

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
		paramsToForget,
		...data
	}: CreateBannerServiceRequest) {
		await this.bannerRepository.create({
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

		forgetAllListingCacheKeysEvent.emit("forget-all-listing-cache-keys", {
			baseCacheKey: "banners",
			paramsToForget
		});
	}
}
