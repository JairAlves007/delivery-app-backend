import z from "zod";

import { BannerLinkType } from "@/generated/prisma/client.js";
import type { IBannerRepository } from "@/interfaces/repositories/banner-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import { createBannerBodySchema } from "@/schemas/banner-schema.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";
import type { EstablishmentID } from "@/types/establishment.js";

type CreateBannerServiceRequest = z.infer<typeof createBannerBodySchema> &
	Pick<ForgetAllListingCacheKeysParams, "paramsToForget"> & {
		establishmentId: EstablishmentID;
	};

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

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "banners",
			paramsToForget
		});
	}
}
