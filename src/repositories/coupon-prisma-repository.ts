import type { ICouponRepository } from "@/interfaces/repositories/coupon-repository.ts";
import { prisma } from "@/lib/prisma.ts";
import type { Coupon, Prisma } from "@prisma/client";

export class CouponPrismaRepository implements ICouponRepository {
	async listAll(): Promise<Coupon[]> {
		return await prisma.coupon.findMany({
			where: {
				deleted_at: null
			}
		});
	}

	async count(): Promise<number> {
		return await prisma.coupon.count({
			where: {
				deleted_at: null
			}
		});
	}

	async paginate(page: number, limit: number): Promise<Coupon[]> {
		return await prisma.coupon.findMany({
			skip: (page - 1) * limit,
			take: limit,
			where: {
				deleted_at: null
			}
		});
	}

	async findById(id: number): Promise<Coupon | null> {
		return await prisma.coupon.findUnique({
			where: {
				id,
				deleted_at: null
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
