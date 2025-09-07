import type { Coupon, Prisma } from "@prisma/client";
import type { ICRUDBase } from "../crud-base.ts";
import type { CouponWithUserCoupons } from "@/types/coupon.ts";

export interface ICouponRepository
	extends ICRUDBase<
		Coupon,
		Prisma.CouponCreateInput,
		Prisma.CouponUpdateInput,
		number
	> {
	check(
		code: string,
		establishmentId: string,
		userId: string
	): Promise<CouponWithUserCoupons | null>;
}
