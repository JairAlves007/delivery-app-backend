import type { ICouponRepository } from "@/interfaces/repositories/coupon-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";
import type { FilterField } from "@/types/crud.js";

type DeleteCouponParams = {
  id: string;
} & FilterField &
  Pick<ForgetAllListingCacheKeysParams, "paramsToForget">;

export class DeleteCouponService {
  private couponRepository: ICouponRepository;

  constructor(couponRepository: ICouponRepository) {
    this.couponRepository = couponRepository;
  }

  async handle({ id, filterParams, paramsToForget }: DeleteCouponParams) {
    await this.couponRepository.delete({
      id,
      filterParams,
      force: false,
    });

    await forgetAllListingCacheKeysQueue({
      baseCacheKey: "coupons",
      paramsToForget,
    });
  }
}
