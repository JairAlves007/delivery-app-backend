import { CouponNotFound } from "@/errors/coupon/not-found.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import type { ICouponRepository } from "@/interfaces/repositories/coupon-repository.ts";
import { couponParamsSchema } from "@/schemas/coupon-schema.ts";
import type { Coupon } from "@prisma/client";
import z from "zod";

type FindCouponServiceRequest = z.infer<typeof couponParamsSchema>;

export class FindCouponService {
	private couponRepository: ICouponRepository;

	constructor(couponRepository: ICouponRepository) {
		this.couponRepository = couponRepository;
	}

	async handle({ id }: FindCouponServiceRequest): Promise<Coupon> {
		const cache = makeCache();
		const key = `${cache.keys.coupons}_${id}`;

		const coupon = await cache.rememberForever(
			key,
			async () => await this.couponRepository.findById({ id })
		);

		if (!coupon) {
			await cache.forget(key);
			throw new CouponNotFound();
		}

		return coupon;
	}
}
