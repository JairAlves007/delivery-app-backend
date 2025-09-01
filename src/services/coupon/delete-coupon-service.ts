import type { ICouponRepository } from "@/interfaces/repositories/coupon-repository.ts";

export class DeleteCouponService {
	private couponRepository: ICouponRepository;

	constructor(couponRepository: ICouponRepository) {
		this.couponRepository = couponRepository;
	}

	async handle(id: number) {
		await this.couponRepository.delete(id, false);
	}
}
