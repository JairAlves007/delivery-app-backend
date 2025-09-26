import { transformValidFilterParams } from "@/helpers/crud.ts";
import type { ICouponRepository } from "@/interfaces/repositories/coupon-repository.ts";
import { prisma } from "@/lib/prisma.ts";
import type { CouponWithUserCoupons } from "@/types/coupon.ts";
import type {
	DeleteContentParams,
	FilterParams,
	FindByIdParams,
	PaginationParams,
	UpdateContentParams
} from "@/types/crud.ts";
import type { Coupon, Prisma } from "@prisma/client";

export class CouponPrismaRepository implements ICouponRepository {
	async listAll(filterParams?: FilterParams): Promise<Coupon[]> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.coupon.findMany({
			where: {
				deleted_at: null,
				...params
			}
		});
	}

	async count(filterParams?: FilterParams): Promise<number> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.coupon.count({
			where: {
				deleted_at: null,
				...params
			}
		});
	}

	async paginate({
		perPage,
		page,
		filterParams
	}: PaginationParams): Promise<Coupon[]> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.coupon.findMany({
			skip: (page - 1) * perPage,
			take: perPage,
			where: {
				deleted_at: null,
				...params
			}
		});
	}

	async findById({
		id,
		filterParams
	}: FindByIdParams<number>): Promise<Coupon | null> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.coupon.findUnique({
			where: {
				id,
				deleted_at: null,
				...params
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

	async update({
		id,
		data,
		filterParams
	}: UpdateContentParams<number, Prisma.CouponUpdateInput>): Promise<Coupon> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.coupon.update({
			where: {
				id,
				deleted_at: null,
				...params
			},
			data
		});
	}

	async delete({
		id,
		force,
		filterParams
	}: DeleteContentParams<number>): Promise<Coupon> {
		const params = transformValidFilterParams(filterParams);

		if (force) {
			return await prisma.coupon.delete({
				where: {
					id,
					...params
				}
			});
		}

		return await this.update({
			id,
			filterParams,
			data: { deleted_at: new Date() }
		});
	}
}
