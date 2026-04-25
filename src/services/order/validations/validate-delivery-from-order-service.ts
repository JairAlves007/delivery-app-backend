import { makeFindAddressService } from "@/factories/services/address/make-find-address-service.js";
import { makeFindDistrictService } from "@/factories/services/district/make-find-district-service.js";
import { makeValidateCouponFromOrderService } from "@/factories/services/order/validations/make-validate-coupon-from-order-service.js";
import { DeliveryType } from "@/generated/prisma/client.js";
import type { EstablishmentID } from "@/types/establishment.js";
import type { OrderInfo } from "@/types/order.js";
import type { UserID } from "@/types/user.js";

type ValidateDeliveryFromOrderServiceRequest = {
  establishmentId: EstablishmentID;
  userId: UserID;
  deliveryType: DeliveryType;
  couponId?: number | null;
  addressId?: string | null;
  districtId?: string | null;
};

export class ValidateDeliveryFromOrderService {
  async handle({
    deliveryType,
    establishmentId,
    userId,
    couponId,
    addressId,
    districtId,
  }: ValidateDeliveryFromOrderServiceRequest): Promise<OrderInfo> {
    const orderInfos: OrderInfo = {
      coupon: null,
      address: null,
      district: null,
    };

    if (deliveryType !== DeliveryType.DELIVERY) return orderInfos;

    const findAddressService = makeFindAddressService();
    const findDistrictService = makeFindDistrictService();
    const validateCouponService = makeValidateCouponFromOrderService();

    const [address, district, coupon] = await Promise.all([
      addressId
        ? findAddressService.handle({
            id: addressId,
            filterParams: { user_id: userId },
          })
        : null,
      districtId
        ? findDistrictService.handle({
            id: districtId,
            filterParams: { establishment_id: establishmentId },
          })
        : null,
      couponId
        ? validateCouponService.handle({ couponId, establishmentId, userId })
        : null,
    ]);

    if (address) orderInfos.address = address;
    if (district) orderInfos.district = district;
    if (coupon) orderInfos.coupon = coupon;

    return orderInfos;
  }
}
