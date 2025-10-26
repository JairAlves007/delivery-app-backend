import {
	buildFilterQueryOptions,
	transformValidFilterParams
} from "@/helpers/crud.ts";
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
import type { EstablishmentID } from "@/types/establishment.ts";
import type { Coupon, Prisma } from "@prisma/client";

export class CouponPrismaRepository implements ICouponRepository {
	async listAll(filterParams?: FilterParams): Promise<Coupon[]> {
		const { search, sortField, sortOrder, ...params } =
			transformValidFilterParams(filterParams);

		const { where, orderBy } =
			buildFilterQueryOptions<Prisma.CouponOrderByWithRelationInput>({
				search,
				sortField: sortField ?? "id",
				sortOrder: sortOrder ?? "asc",
				searchableFields: ["code"],
				defaultSortField: "id"
			});

		return await prisma.coupon.findMany({
			where: {
				deleted_at: null,
				...where,
				...params
			},
			orderBy
		});
	}

	async count(filterParams?: FilterParams): Promise<number> {
		const {
			search,
			sortField = undefined,
			sortOrder = undefined,
			...params
		} = transformValidFilterParams(filterParams);

		const { where, orderBy } =
			buildFilterQueryOptions<Prisma.CouponOrderByWithRelationInput>({
				search,
				sortField,
				sortOrder,
				searchableFields: ["code"],
				defaultSortField: "id"
			});

		return await prisma.coupon.count({
			where: {
				deleted_at: null,
				...where,
				...params
			},
			orderBy
		});
	}

	async paginate({
		perPage,
		page,
		filterParams
	}: PaginationParams): Promise<Coupon[]> {
		const { search, sortField, sortOrder, ...params } =
			transformValidFilterParams(filterParams);

		const { where, orderBy } =
			buildFilterQueryOptions<Prisma.CouponOrderByWithRelationInput>({
				search,
				sortField: sortField ?? "id",
				sortOrder: sortOrder ?? "asc",
				searchableFields: ["code"],
				defaultSortField: "id"
			});

		return await prisma.coupon.findMany({
			skip: (page - 1) * perPage,
			take: perPage,
			where: {
				deleted_at: null,
				...where,
				...params
			},
			orderBy
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
		establishmentId: EstablishmentID,
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

	async create(data: Prisma.CouponCreateInput): Promise<void> {
		await prisma.coupon.create({ data });
	}

	async update({
		id,
		data,
		filterParams
	}: UpdateContentParams<number, Prisma.CouponUpdateInput>): Promise<void> {
		const params = transformValidFilterParams(filterParams);

		await prisma.coupon.update({
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
	}: DeleteContentParams<number>): Promise<void> {
		const params = transformValidFilterParams(filterParams);

		if (force) {
			await prisma.coupon.delete({
				where: {
					id,
					...params
				}
			});
		}

		await this.update({
			id,
			filterParams,
			data: { deleted_at: new Date() }
		});
	}
}
