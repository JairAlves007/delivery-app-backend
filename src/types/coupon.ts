import { Prisma } from "@/generated/prisma/client.ts";

export type ValidationReason =
	| "VALID"
	| "NOT_FOUND"
	| "EXPIRED"
	| "MAX_USES_REACHED"
	| "USER_LIMIT_REACHED";

export type CouponWithUserCoupons = Prisma.CouponGetPayload<{
	include: { userCoupons: true };
}>;
