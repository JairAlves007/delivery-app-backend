import type { ICouponRepository } from "@/interfaces/repositories/coupon-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";

type DeleteCouponParams = {
	id: number;
} & Pick<ForgetAllListingCacheKeysParams, "paramsToForget">;

export class DeleteCouponService {
	private couponRepository: ICouponRepository;

	constructor(couponRepository: ICouponRepository) {
		this.couponRepository = couponRepository;
	}

	async handle({ id, paramsToForget }: DeleteCouponParams) {
		await this.couponRepository.delete({ id, force: false });

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "coupons",
			paramsToForget
		});
	}
}
