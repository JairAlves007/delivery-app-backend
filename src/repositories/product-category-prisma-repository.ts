import type { Prisma } from "@/generated/prisma/client.ts";
import {
	buildFilterQueryOptions,
	transformValidFilterParams
} from "@/helpers/crud.ts";
import type { IProductCategoryRepository } from "@/interfaces/repositories/product-category-repository.ts";
import prisma from "@/lib/prisma.ts";
import type {
	CursorPaginationParams,
	DeleteContentParams,
	FilterParams,
	FindByIdParams,
	PaginationParams,
	UpdateContentParams
} from "@/types/crud.ts";
import type { ProductCategoryFromRepository } from "@/types/product-category.ts";

export class ProductCategoryPrismaRepository implements IProductCategoryRepository {
	async listAll(
		filterParams?: FilterParams
	): Promise<ProductCategoryFromRepository[]> {
		const { search, sortField, sortOrder, ...params } =
			transformValidFilterParams(filterParams);

		const { where, orderBy } =
			buildFilterQueryOptions<Prisma.ProductCategoryOrderByWithRelationInput>({
				search,
				sortField: sortField ?? "order",
				sortOrder: sortOrder ?? "asc",
				searchableFields: ["name", "slug"],
				defaultSortField: "order"
			});

		return await prisma.productCategory.findMany({
			where: {
				deleted_at: null,
				...where,
				...params
			},
			include: {
				resources: {
					select: {
						resource: true
					}
				}
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

		const { where } =
			buildFilterQueryOptions<Prisma.ProductCategoryOrderByWithRelationInput>({
				search,
				sortField,
				sortOrder,
				searchableFields: ["name", "slug"],
				defaultSortField: "order"
			});

		return await prisma.productCategory.count({
			where: {
				deleted_at: null,
				...where,
				...params
			}
		});
	}

	async paginate({
		page,
		perPage,
		filterParams
	}: PaginationParams): Promise<ProductCategoryFromRepository[]> {
		const { search, sortField, sortOrder, ...params } =
			transformValidFilterParams(filterParams);

		const { where, orderBy } =
			buildFilterQueryOptions<Prisma.ProductCategoryOrderByWithRelationInput>({
				search,
				sortField: sortField ?? "order",
				sortOrder: sortOrder ?? "asc",
				searchableFields: ["name", "slug"],
				defaultSortField: "order"
			});

		return await prisma.productCategory.findMany({
			skip: (page - 1) * perPage,
			take: perPage,
			where: {
				deleted_at: null,
				...where,
				...params
			},
			include: {
				resources: {
					select: {
						resource: true
					}
				}
			},
			orderBy
		});
	}

	async cursorPaginate({
		limit,
		cursor,
		filterParams
	}: CursorPaginationParams<string>): Promise<ProductCategoryFromRepository[]> {
		const { search, sortField, sortOrder, ...params } =
			transformValidFilterParams(filterParams);

		const { where, orderBy } =
			buildFilterQueryOptions<Prisma.ProductCategoryOrderByWithRelationInput>({
				search,
				sortField: sortField ?? "order",
				sortOrder: sortOrder ?? "asc",
				searchableFields: ["name", "slug"],
				defaultSortField: "order"
			});

		return await prisma.productCategory.findMany({
			where: {
				deleted_at: null,
				...where,
				products: {
					some: {
						deleted_at: null,
						OR: [{ valid_until: null }, { valid_until: { gt: new Date() } }],
						...params
					}
				},
				...params
			},
			include: {
				resources: {
					select: {
						resource: true
					}
				}
			},
			orderBy,
			take: limit + 1,
			skip: cursor ? 1 : 0,
			cursor: !!cursor ? { id: cursor } : undefined
		});
	}

	async findById({
		id,
		filterParams
	}: FindByIdParams<string>): Promise<ProductCategoryFromRepository | null> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.productCategory.findUnique({
			where: {
				id,
				deleted_at: null,
				...params
			},
			include: {
				resources: {
					select: {
						resource: true
					}
				}
			}
		});
	}

	async create(data: Prisma.ProductCategoryCreateInput): Promise<void> {
		await prisma.productCategory.create({ data });
	}

	async update({
		id,
		data,
		filterParams
	}: UpdateContentParams<
		string,
		Prisma.ProductCategoryUpdateInput
	>): Promise<void> {
		const params = transformValidFilterParams(filterParams);

		await prisma.productCategory.update({
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
			await prisma.productCategory.delete({
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
