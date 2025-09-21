import type { IProductCategoryRepository } from "@/interfaces/repositories/product-category-repository.ts";
import { prisma } from "@/lib/prisma.ts";
import type { Prisma, ProductCategory } from "@prisma/client";

export class ProductCategoryPrismaRepository
	implements IProductCategoryRepository
{
	async listAll(filterId?: string | null): Promise<ProductCategory[]> {
		return await prisma.productCategory.findMany({
			where: {
				deleted_at: null,
				...(!!filterId && { establishment_id: filterId })
			},
			orderBy: {
				order: "asc"
			}
		});
	}

	async count(filterId?: string | null): Promise<number> {
		return await prisma.productCategory.count({
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
	): Promise<ProductCategory[]> {
		return await prisma.productCategory.findMany({
			skip: (page - 1) * limit,
			take: limit,
			where: {
				deleted_at: null,
				...(!!filterId && { establishment_id: filterId })
			},
			orderBy: {
				order: "asc"
			}
		});
	}

	async findById(
		id: string,
		filterId?: string | null
	): Promise<ProductCategory | null> {
		return await prisma.productCategory.findUnique({
			where: {
				id,
				deleted_at: null,
				...(!!filterId && { establishment_id: filterId })
			}
		});
	}

	async create(
		data: Prisma.ProductCategoryCreateInput
	): Promise<ProductCategory> {
		return await prisma.productCategory.create({ data });
	}

	async update(
		id: string,
		data: Partial<Prisma.ProductCategoryCreateInput>
	): Promise<ProductCategory> {
		return await prisma.productCategory.update({
			where: {
				id,
				deleted_at: null
			},
			data
		});
	}

	async delete(id: string, force: boolean): Promise<ProductCategory> {
		if (force) {
			return await prisma.productCategory.delete({
				where: {
					id
				}
			});
		}

		return await this.update(id, { deleted_at: new Date() });
	}
}
