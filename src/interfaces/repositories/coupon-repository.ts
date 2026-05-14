import type { Coupon, Prisma } from "@/generated/prisma/client.js";
import type { CouponWithUserCoupons } from "@/types/coupon.js";
import type { EstablishmentID } from "@/types/establishment.js";

import type { ICRUDBase } from "../crud-base.js";

export interface ICouponRepository extends ICRUDBase<
	Coupon,
	Prisma.CouponCreateInput,
	Prisma.CouponUpdateInput,
	number
> {
	check(
		code: string,
		establishmentId: EstablishmentID,
		customerPhone?: string | null
	): Promise<CouponWithUserCoupons | null>;
}
