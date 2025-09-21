import type { IProductRepository } from "@/interfaces/repositories/product-repository.ts";
import { prisma } from "@/lib/prisma.ts";
import type { Prisma, Product } from "@prisma/client";

export class ProductPrismaRepository implements IProductRepository {
	async listAll(filterId: string | null): Promise<Product[]> {
		return await prisma.product.findMany({
			where: {
				deleted_at: null,
				...(!!filterId && { establishment_id: filterId })
			},
			orderBy: {
				created_at: "desc"
			}
		});
	}

	async count(filterId: string | null): Promise<number> {
		return await prisma.product.count({
			where: {
				deleted_at: null,
				...(!!filterId && { establishment_id: filterId })
			}
		});
	}

	async paginate(
		page: number,
		limit: number,
		filterId: string | null
	): Promise<Product[]> {
		return await prisma.product.findMany({
			skip: (page - 1) * limit,
			take: limit,
			where: {
				deleted_at: null,
				...(!!filterId && { establishment_id: filterId })
			},
			orderBy: {
				created_at: "desc"
			}
		});
	}

	async cursorPaginate(
		limit: number,
		cursor?: string | null,
		filterId?: string | null
	): Promise<Product[]> {
		return await prisma.product.findMany({
			where: {
				...(!!filterId && { establishment_id: filterId }),
				deleted_at: null
			},
			orderBy: {
				created_at: "desc"
			},
			take: limit + 1,
			skip: cursor ? 1 : 0,
			cursor: !!cursor ? { id: cursor } : undefined
		});
	}

	async getCatalog(
		establishmentId: string,
		limit: number,
		cursor?: string | null
	): Promise<Product[]> {
		return await this.cursorPaginate(limit, cursor, establishmentId);
	}

	async findById(
		id: string,
		filterId?: string | null
	): Promise<Product | null> {
		return await prisma.product.findUnique({
			where: {
				id,
				deleted_at: null,
				...(!!filterId && { establishment_id: filterId })
			}
		});
	}

	async create(data: Prisma.ProductCreateInput): Promise<Product> {
		return await prisma.product.create({ data });
	}

	async update(id: string, data: Prisma.ProductUpdateInput): Promise<Product> {
		return await prisma.product.update({
			where: {
				id,
				deleted_at: null
			},
			data
		});
	}

	async delete(id: string, force: boolean): Promise<Product> {
		if (force) {
			return await prisma.product.delete({
				where: {
					id
				}
			});
		}

		return await this.update(id, { deleted_at: new Date() });
	}

	async deleteOldTags(id: string): Promise<void> {
		await prisma.productTag.deleteMany({
			where: {
				product_id: id
			}
		});
	}
}
