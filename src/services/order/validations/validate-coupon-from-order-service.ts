import { CouponNotFound } from "@/errors/coupon/not-found.js";
import { makeCheckCouponService } from "@/factories/services/coupon/make-check-coupon-service.js";
import { makeFindCouponService } from "@/factories/services/coupon/make-find-coupon-service.js";
import type { Coupon } from "@/generated/prisma/client.js";
import type { EstablishmentID } from "@/types/establishment.js";
import type { UserID } from "@/types/user.js";

type ValidateCouponFromOrderServiceRequest = {
  establishmentId: EstablishmentID;
  userId: UserID;
  couponId: number;
};

export class ValidateCouponFromOrderService {
  async handle({
    establishmentId,
    couponId,
    userId,
  }: ValidateCouponFromOrderServiceRequest): Promise<Coupon> {
    const filterParams = { establishment_id: establishmentId };

    const findCouponService = makeFindCouponService();
    const coupon = await findCouponService.handle({
      id: couponId,
      filterParams,
    });

    if (!coupon) throw new CouponNotFound();

    const checkCoupon = makeCheckCouponService();

    await checkCoupon.handle({
      code: coupon.code,
      establishmentId,
      userId,
    });

    return coupon;
  }
}
