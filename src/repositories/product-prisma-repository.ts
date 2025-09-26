import { transformValidFilterParams } from "@/helpers/crud.ts";
import type { IProductRepository } from "@/interfaces/repositories/product-repository.ts";
import { prisma } from "@/lib/prisma.ts";
import type {
	CursorPaginationParams,
	DeleteContentParams,
	FilterParams,
	FindByIdParams,
	PaginationParams,
	UpdateContentParams
} from "@/types/crud.ts";
import type { Prisma, Product } from "@prisma/client";

export class ProductPrismaRepository implements IProductRepository {
	async listAll(filterParams?: FilterParams): Promise<Product[]> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.product.findMany({
			where: {
				deleted_at: null,
				...params
			},
			orderBy: {
				created_at: "desc"
			}
		});
	}

	async count(filterParams?: FilterParams): Promise<number> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.product.count({
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
	}: PaginationParams): Promise<Product[]> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.product.findMany({
			skip: (page - 1) * perPage,
			take: perPage,
			where: {
				deleted_at: null,
				...params
			},
			orderBy: {
				created_at: "desc"
			}
		});
	}

	async cursorPaginate({
		limit,
		cursor,
		filterParams
	}: CursorPaginationParams<string>): Promise<Product[]> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.product.findMany({
			where: {
				deleted_at: null,
				...params
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
		return await this.cursorPaginate({
			limit,
			cursor,
			filterParams: { establishment_id: establishmentId }
		});
	}

	async findById({
		id,
		filterParams
	}: FindByIdParams<string>): Promise<Product | null> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.product.findUnique({
			where: {
				id,
				deleted_at: null,
				...params
			}
		});
	}

	async create(data: Prisma.ProductCreateInput): Promise<Product> {
		return await prisma.product.create({ data });
	}

	async update({
		id,
		data,
		filterParams
	}: UpdateContentParams<string, Prisma.ProductUpdateInput>): Promise<Product> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.product.update({
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
	}: DeleteContentParams<string>): Promise<Product> {
		const params = transformValidFilterParams(filterParams);

		if (force) {
			return await prisma.product.delete({
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

	async deleteOldTags(id: string): Promise<void> {
		await prisma.productTag.deleteMany({
			where: {
				product_id: id
			}
		});
	}
}
