import { makeFindDistrictService } from "@/factories/services/district/make-find-district-service.js";
import { makeValidateCouponFromOrderService } from "@/factories/services/order/validations/make-validate-coupon-from-order-service.js";
import { DeliveryType } from "@/generated/prisma/client.js";
import type { EstablishmentID } from "@/types/establishment.js";
import type { GuestAddress, OrderAddressInput, OrderInfo } from "@/types/order.js";

type ValidateDeliveryFromOrderServiceRequest = {
  establishmentId: EstablishmentID;
  deliveryType: DeliveryType;
  customerName: string;
  customerPhone: string;
  couponId?: string | null;
  districtId?: string | null;
  address?: OrderAddressInput | null;
};

export class ValidateDeliveryFromOrderService {
  async handle({
    deliveryType,
    establishmentId,
    customerName,
    customerPhone,
    couponId,
    districtId,
    address,
  }: ValidateDeliveryFromOrderServiceRequest): Promise<OrderInfo> {
    const orderInfos: OrderInfo = {
      coupon: null,
      address: null,
      district: null,
    };

    if (deliveryType !== DeliveryType.DELIVERY) return orderInfos;

    const findDistrictService = makeFindDistrictService();
    const validateCouponService = makeValidateCouponFromOrderService();

    const [district, coupon] = await Promise.all([
      districtId
        ? findDistrictService.handle({
            id: districtId,
            filterParams: { establishment_id: establishmentId },
          })
        : null,
      couponId
        ? validateCouponService.handle({ couponId, establishmentId, customerPhone })
        : null,
    ]);

    if (district) orderInfos.district = district;
    if (coupon) orderInfos.coupon = coupon;

    if (address?.street && address?.neighborhood && address?.city && address?.state) {
      const guestAddress: GuestAddress = {
        customerName,
        phone: address.phone,
        street: address.street,
        number: address.number ?? null,
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        complement: address.complement ?? null,
        referencePoint: address.referencePoint ?? null,
      };

      orderInfos.address = guestAddress;
    }

    return orderInfos;
  }
}
