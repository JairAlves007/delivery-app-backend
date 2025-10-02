import { transformValidFilterParams } from "@/helpers/crud.ts";
import type { IProductCategoryRepository } from "@/interfaces/repositories/product-category-repository.ts";
import { prisma } from "@/lib/prisma.ts";
import type {
	DeleteContentParams,
	FilterParams,
	FindByIdParams,
	PaginationParams,
	UpdateContentParams
} from "@/types/crud.ts";
import type { ProductCategoryFromRepository } from "@/types/product-category.ts";
import type { Prisma } from "@prisma/client";

export class ProductCategoryPrismaRepository
	implements IProductCategoryRepository
{
	async listAll(
		filterParams?: FilterParams
	): Promise<ProductCategoryFromRepository[]> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.productCategory.findMany({
			where: {
				deleted_at: null,
				...params
			},
			include: {
				resources: {
					select: {
						resource: true
					}
				}
			},
			orderBy: {
				order: "asc"
			}
		});
	}

	async count(filterParams?: FilterParams): Promise<number> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.productCategory.count({
			where: {
				deleted_at: null,
				...params
			}
		});
	}

	async paginate({
		page,
		perPage,
		filterParams
	}: PaginationParams): Promise<ProductCategoryFromRepository[]> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.productCategory.findMany({
			skip: (page - 1) * perPage,
			take: perPage,
			where: {
				deleted_at: null,
				...params
			},
			include: {
				resources: {
					select: {
						resource: true
					}
				}
			},
			orderBy: {
				order: "asc"
			}
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
