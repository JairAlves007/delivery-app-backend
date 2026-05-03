import type { Coupon, Prisma } from "@/generated/prisma/client.js";
import type { CouponWithUserCoupons } from "@/types/coupon.js";
import type { EstablishmentID } from "@/types/establishment.js";
import type { UserID } from "@/types/user.js";

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
		userId: UserID
	): Promise<CouponWithUserCoupons | null>;
}
