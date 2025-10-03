import type { Coupon, Prisma } from "@prisma/client";
import type { ICRUDBase } from "../crud-base.ts";
import type { CouponWithUserCoupons } from "@/types/coupon.ts";
import type { EstablishmentID } from "@/types/establishment.ts";

export interface ICouponRepository
	extends ICRUDBase<
		Coupon,
		Prisma.CouponCreateInput,
		Prisma.CouponUpdateInput,
		number
	> {
	check(
		code: string,
		establishmentId: EstablishmentID,
		userId: string
	): Promise<CouponWithUserCoupons | null>;
}
