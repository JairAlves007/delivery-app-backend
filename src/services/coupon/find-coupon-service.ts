import { CouponNotFound } from "@/errors/coupon/not-found.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import type { Coupon } from "@/generated/prisma/client.ts";
import { getFilterParamsCacheKey } from "@/helpers/crud.ts";
import type { ICouponRepository } from "@/interfaces/repositories/coupon-repository.ts";
import { couponParamsSchema } from "@/schemas/coupon-schema.ts";
import type { FilterField } from "@/types/crud.ts";
import z from "zod";

type FindCouponServiceRequest = z.infer<typeof couponParamsSchema> &
	FilterField;

export class FindCouponService {
	private couponRepository: ICouponRepository;

	constructor(couponRepository: ICouponRepository) {
		this.couponRepository = couponRepository;
	}

	async handle({
		id,
		filterParams
	}: FindCouponServiceRequest): Promise<Coupon> {
		const cache = makeCache();
		const filterPrefixKey = getFilterParamsCacheKey(filterParams);
		const key = `${filterPrefixKey}${cache.keys.coupons}_${id}`;

		const coupon = await cache.rememberForever(
			key,
			async () => await this.couponRepository.findById({ id, filterParams })
		);

		if (!coupon) throw new CouponNotFound();

		return coupon;
	}
}
