import type { ICouponRepository } from "@/interfaces/repositories/coupon-repository.ts";
import { prisma } from "@/lib/prisma.ts";
import type { CouponWithUserCoupons } from "@/types/coupon.ts";
import type { Coupon, Prisma } from "@prisma/client";

export class CouponPrismaRepository implements ICouponRepository {
	async listAll(filterId?: string | null): Promise<Coupon[]> {
		return await prisma.coupon.findMany({
			where: {
				deleted_at: null,
				...(!!filterId && { establishment_id: filterId })
			}
		});
	}

	async count(filterId?: string | null): Promise<number> {
		return await prisma.coupon.count({
			where: {
				deleted_at: null,
				...(!!filterId && { establishment_id: filterId })
			}
		});
	}

	async paginate(
		page: number,
		limit: number,
		filterId?: string | null
	): Promise<Coupon[]> {
		return await prisma.coupon.findMany({
			skip: (page - 1) * limit,
			take: limit,
			where: {
				deleted_at: null,
				...(!!filterId && { establishment_id: filterId })
			}
		});
	}

	async findById(id: number, filterId?: string | null): Promise<Coupon | null> {
		return await prisma.coupon.findUnique({
			where: {
				id,
				deleted_at: null,
				...(!!filterId && { establishment_id: filterId })
			}
		});
	}

	async check(
		code: string,
		establishmentId: string,
		userId: string
	): Promise<CouponWithUserCoupons | null> {
		return await prisma.coupon.findUnique({
			where: {
				code,
				establishment_id: establishmentId,
				deleted_at: null
			},
			include: {
				userCoupons: {
					where: {
						user_id: userId
					}
				}
			}
		});
	}

	async create(data: Prisma.CouponCreateInput): Promise<Coupon> {
		return await prisma.coupon.create({ data });
	}

	async update(id: number, data: Prisma.CouponUpdateInput): Promise<Coupon> {
		return await prisma.coupon.update({
			where: {
				id,
				deleted_at: null
			},
			data
		});
	}

	async delete(id: number, force: boolean): Promise<Coupon> {
		if (force) {
			return await prisma.coupon.delete({
				where: {
					id
				}
			});
		}

		return await this.update(id, { deleted_at: new Date() });
	}
}
