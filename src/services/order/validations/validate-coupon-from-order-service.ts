import { CouponNotFound } from "@/errors/coupon/not-found.js";
import { makeCheckCouponService } from "@/factories/services/coupon/make-check-coupon-service.js";
import { makeFindCouponService } from "@/factories/services/coupon/make-find-coupon-service.js";
import type { Coupon } from "@/generated/prisma/client.js";
import type { EstablishmentID } from "@/types/establishment.js";

type ValidateCouponFromOrderServiceRequest = {
  establishmentId: EstablishmentID;
  couponId: string;
  customerPhone: string;
};

export class ValidateCouponFromOrderService {
  async handle({
    establishmentId,
    couponId,
    customerPhone,
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
      customerPhone,
    });

    return coupon;
  }
}
