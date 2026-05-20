import type { Coupon, Prisma } from "@/generated/prisma/client.js";
import {
	buildFilterQueryOptions,
	transformValidFilterParams
} from "@/helpers/crud.js";
import type { ICouponRepository } from "@/interfaces/repositories/coupon-repository.js";
import prisma from "@/lib/prisma.js";
import type { CouponWithUserCoupons } from "@/types/coupon.js";
import type {
	DeleteContentParams,
	FilterParams,
	FindByIdParams,
	PaginationParams,
	UpdateContentParams
} from "@/types/crud.js";
import type { EstablishmentID } from "@/types/establishment.js";

export class CouponPrismaRepository implements ICouponRepository {
	async listAll(filterParams?: FilterParams): Promise<Coupon[]> {
		const { search, sortField, sortDirection, ...params } =
			transformValidFilterParams(filterParams);

		const { where, orderBy } =
			buildFilterQueryOptions<Prisma.CouponOrderByWithRelationInput>({
				search,
				sortField: sortField ?? "id",
				sortDirection: sortDirection ?? "asc",
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
			sortDirection = undefined,
			...params
		} = transformValidFilterParams(filterParams);

		const { where, orderBy } =
			buildFilterQueryOptions<Prisma.CouponOrderByWithRelationInput>({
				search,
				sortField,
				sortDirection,
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
		const { search, sortField, sortDirection, ...params } =
			transformValidFilterParams(filterParams);

		const { where, orderBy } =
			buildFilterQueryOptions<Prisma.CouponOrderByWithRelationInput>({
				search,
				sortField: sortField ?? "id",
				sortDirection: sortDirection ?? "asc",
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
	}: FindByIdParams<string>): Promise<Coupon | null> {
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
		customerPhone?: string | null
	): Promise<CouponWithUserCoupons | null> {
		return await prisma.coupon.findUnique({
			where: {
				code,
				establishment_id: establishmentId,
				deleted_at: null
			},
			include: {
				userCoupons: {
					where: customerPhone ? { customer_phone: customerPhone } : { customer_phone: "" }
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
	}: UpdateContentParams<string, Prisma.CouponUpdateInput>): Promise<void> {
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
	}: DeleteContentParams<string>): Promise<void> {
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
