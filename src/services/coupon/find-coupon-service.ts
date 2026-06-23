import z from "zod";

import { CouponNotFound } from "@/errors/coupon/not-found.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import Constants from "@/helpers/constants.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import type { ICouponRepository } from "@/interfaces/repositories/coupon-repository.js";
import { couponParamsSchema } from "@/schemas/coupon-schema.js";
import type { CouponWithScope } from "@/types/coupon.js";
import type { FilterField } from "@/types/crud.js";

type FindCouponServiceRequest = z.infer<typeof couponParamsSchema> &
  FilterField;

export class FindCouponService {
  private couponRepository: ICouponRepository;

  constructor(couponRepository: ICouponRepository) {
    this.couponRepository = couponRepository;
  }

  async handle({
    id,
    filterParams,
  }: FindCouponServiceRequest): Promise<CouponWithScope> {
    const cache = makeCache();
    const filterPrefixKey = getFilterParamsCacheKey(filterParams);
    const key = `${filterPrefixKey}${cache.keys.coupons}_${id}`;

    const coupon = await cache.remember(
      key,
      Constants.CACHE_TTL.coupons,
      async () =>
        await this.couponRepository.findByIdWithScope({ id, filterParams }),
      { domain: "coupons", establishmentId: filterParams?.establishment_id },
    );

    if (!coupon) throw new CouponNotFound();

    return coupon;
  }
}
