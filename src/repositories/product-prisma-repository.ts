import type { IProductRepository } from "@/interfaces/repositories/product-repository.ts";
import { prisma } from "@/lib/prisma.ts";
import type { Prisma, Product } from "@prisma/client";

export class ProductPrismaRepository implements IProductRepository {
	async listAll(): Promise<Product[]> {
		return await prisma.product.findMany({
			where: {
				deleted_at: null
			},
			orderBy: {
				created_at: "desc"
			}
		});
	}

	async count(): Promise<number> {
		return await prisma.product.count({
			where: {
				deleted_at: null
			}
		});
	}

	async paginate(page: number, limit: number): Promise<Product[]> {
		return await prisma.product.findMany({
			skip: (page - 1) * limit,
			take: limit,
			where: {
				deleted_at: null
			},
			orderBy: {
				created_at: "desc"
			}
		});
	}

	async findById(id: string): Promise<Product | null> {
		return await prisma.product.findUnique({
			where: {
				id,
				deleted_at: null
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
}
