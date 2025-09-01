import type { Coupon, Prisma } from "@prisma/client";
import type { ICRUDBase } from "../crud-base.ts";

export interface ICouponRepository
	extends ICRUDBase<
		Coupon,
		Prisma.CouponCreateInput,
		Prisma.CouponUpdateInput,
		number
	> {}
