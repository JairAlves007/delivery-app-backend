import type { Prisma, Promotion } from "@/generated/prisma/client.js";
import {
	buildFilterQueryOptions,
	transformValidFilterParams
} from "@/helpers/crud.js";
import type { IPromotionRepository } from "@/interfaces/repositories/promotion-repository.js";
import prisma from "@/lib/prisma.js";
import type {
	DeleteContentParams,
	FilterParams,
	FindByIdParams,
	PaginationParams,
	UpdateContentParams
} from "@/types/crud.js";
import type { EstablishmentID } from "@/types/establishment.js";
import type { PromotionWithRelations } from "@/types/promotion.js";

const relationsInclude = {
	windows: true,
	promotionProducts: { select: { product_id: true } },
	promotionCategories: { select: { category_id: true } }
} satisfies Prisma.PromotionInclude;

export class PromotionPrismaRepository implements IPromotionRepository {
	async listAll(filterParams?: FilterParams): Promise<Promotion[]> {
		const { search, sortField, sortDirection, ...params } =
			transformValidFilterParams(filterParams);

		const { where, orderBy } =
			buildFilterQueryOptions<Prisma.PromotionOrderByWithRelationInput>({
				search,
				sortField: sortField ?? "id",
				sortDirection: sortDirection ?? "asc",
				searchableFields: ["name"],
				defaultSortField: "id"
			});

		return await prisma.promotion.findMany({
			where: { deleted_at: null, ...where, ...params },
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

		const { where } =
			buildFilterQueryOptions<Prisma.PromotionOrderByWithRelationInput>({
				search,
				sortField,
				sortDirection,
				searchableFields: ["name"],
				defaultSortField: "id"
			});

		return await prisma.promotion.count({
			where: { deleted_at: null, ...where, ...params }
		});
	}

	async paginate({
		perPage,
		page,
		filterParams
	}: PaginationParams): Promise<Promotion[]> {
		const { search, sortField, sortDirection, ...params } =
			transformValidFilterParams(filterParams);

		const { where, orderBy } =
			buildFilterQueryOptions<Prisma.PromotionOrderByWithRelationInput>({
				search,
				sortField: sortField ?? "id",
				sortDirection: sortDirection ?? "asc",
				searchableFields: ["name"],
				defaultSortField: "id"
			});

		return await prisma.promotion.findMany({
			skip: (page - 1) * perPage,
			take: perPage,
			where: { deleted_at: null, ...where, ...params },
			orderBy
		});
	}

	async findById({
		id,
		filterParams
	}: FindByIdParams<string>): Promise<Promotion | null> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.promotion.findUnique({
			where: { id, deleted_at: null, ...params }
		});
	}

	async findByIdWithRelations({
		id,
		filterParams
	}: FindByIdParams<string>): Promise<PromotionWithRelations | null> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.promotion.findUnique({
			where: { id, deleted_at: null, ...params },
			include: relationsInclude
		});
	}

	async findActiveByEstablishment(
		establishmentId: EstablishmentID
	): Promise<PromotionWithRelations[]> {
		const now = new Date();

		return await prisma.promotion.findMany({
			where: {
				establishment_id: establishmentId,
				deleted_at: null,
				is_active: true,
				AND: [
					{ OR: [{ starts_at: null }, { starts_at: { lte: now } }] },
					{ OR: [{ ends_at: null }, { ends_at: { gte: now } }] }
				]
			},
			include: relationsInclude
		});
	}

	async create(data: Prisma.PromotionCreateInput): Promise<void> {
		await prisma.promotion.create({ data });
	}

	async update({
		id,
		data,
		filterParams
	}: UpdateContentParams<string, Prisma.PromotionUpdateInput>): Promise<void> {
		const params = transformValidFilterParams(filterParams);

		await prisma.promotion.update({
			where: { id, deleted_at: null, ...params },
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
			await prisma.promotion.delete({ where: { id, ...params } });
		}

		await this.update({
			id,
			filterParams,
			data: { deleted_at: new Date() }
		});
	}
}
