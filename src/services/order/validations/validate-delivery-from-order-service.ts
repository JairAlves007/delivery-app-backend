import type { EstablishmentID } from "@/types/establishment.ts";
import type { OrderInfo } from "@/types/order.ts";
import type { UserID } from "@/types/user.ts";
import { makeFindAddressService } from "@/factories/services/address/make-find-address-service.ts";
import { makeFindDistrictService } from "@/factories/services/district/make-find-district-service.ts";
import { makeValidateCouponFromOrderService } from "@/factories/services/order/validations/make-validate-coupon-from-order-service.ts";
import { DeliveryType } from "@prisma/client";

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
		districtId
	}: ValidateDeliveryFromOrderServiceRequest) {
		const orderInfos: OrderInfo = {
			coupon: null,
			address: null,
			district: null
		};

		if (!!!couponId || deliveryType != DeliveryType.DELIVERY) return orderInfos;

		const validateCoupon = makeValidateCouponFromOrderService();

		orderInfos.coupon = await validateCoupon.handle({
			couponId: couponId,
			establishmentId,
			userId
		});

		const findAddressService = makeFindAddressService();
		const findDistrictService = makeFindDistrictService();

		const [address, district] = await Promise.all([
			addressId
				? findAddressService.handle({
						id: addressId,
						filterParams: { user_id: userId }
				  })
				: null,
			districtId
				? findDistrictService.handle({
						id: districtId,
						filterParams: { establishment_id: establishmentId }
				  })
				: null
		]);

		if (!!address) orderInfos.address = address;

		if (!!district) orderInfos.district = district;

		return orderInfos;
	}
}
