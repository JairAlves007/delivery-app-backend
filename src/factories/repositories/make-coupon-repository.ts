import { CouponPrismaRepository } from "@/repositories/coupon-prisma-repository.ts";

export const makeCouponRepository = () => {
	return new CouponPrismaRepository();
};
