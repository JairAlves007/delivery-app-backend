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
import type { Prisma, ProductCategory } from "@prisma/client";

export class ProductCategoryPrismaRepository
	implements IProductCategoryRepository
{
	async listAll(filterParams?: FilterParams): Promise<ProductCategory[]> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.productCategory.findMany({
			where: {
				deleted_at: null,
				...params
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
	}: PaginationParams): Promise<ProductCategory[]> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.productCategory.findMany({
			skip: (page - 1) * perPage,
			take: perPage,
			where: {
				deleted_at: null,
				...params
			},
			orderBy: {
				order: "asc"
			}
		});
	}

	async findById({
		id,
		filterParams
	}: FindByIdParams<string>): Promise<ProductCategory | null> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.productCategory.findUnique({
			where: {
				id,
				deleted_at: null,
				...params
			}
		});
	}

	async create(
		data: Prisma.ProductCategoryCreateInput
	): Promise<ProductCategory> {
		return await prisma.productCategory.create({ data });
	}

	async update({
		id,
		data,
		filterParams
	}: UpdateContentParams<
		string,
		Prisma.ProductCategoryUpdateInput
	>): Promise<ProductCategory> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.productCategory.update({
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
	}: DeleteContentParams<string>): Promise<ProductCategory> {
		const params = transformValidFilterParams(filterParams);

		if (force) {
			return await prisma.productCategory.delete({
				where: {
					id
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
