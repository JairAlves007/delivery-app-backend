import { makeCache } from "@/factories/services/cache/make-cache.ts";
import type { ICouponRepository } from "@/interfaces/repositories/coupon-repository.ts";

export class DeleteCouponService {
	private couponRepository: ICouponRepository;

	constructor(couponRepository: ICouponRepository) {
		this.couponRepository = couponRepository;
	}

	async handle(id: number) {
		const cache = makeCache();

		await this.couponRepository.delete({ id, force: false });

		await cache.forgetKeysContaining(cache.keys.coupons);
	}
}
