import { transformValidFilterParams } from "@/helpers/crud.ts";
import type { IBannerRepository } from "@/interfaces/repositories/banner-repository.ts";
import { prisma } from "@/lib/prisma.ts";
import type { BannerFromRepository } from "@/types/banner.ts";
import type {
	CursorPaginationParams,
	DeleteContentParams,
	FilterParams,
	FindByIdParams,
	PaginationParams,
	UpdateContentParams
} from "@/types/crud.ts";
import type { Prisma } from "@prisma/client";

export class BannerPrismaRepository implements IBannerRepository {
	async listAll(filterParams?: FilterParams): Promise<BannerFromRepository[]> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.banner.findMany({
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
				created_at: "desc"
			}
		});
	}

	async count(filterParams?: FilterParams): Promise<number> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.banner.count({
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
	}: PaginationParams): Promise<BannerFromRepository[]> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.banner.findMany({
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
				created_at: "desc"
			}
		});
	}

	async cursorPaginate({
		limit,
		cursor,
		filterParams
	}: CursorPaginationParams<number>): Promise<BannerFromRepository[]> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.banner.findMany({
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
				created_at: "desc"
			},
			take: limit + 1,
			skip: cursor ? 1 : 0,
			cursor: !!cursor ? { id: cursor } : undefined
		});
	}

	async findById({
		id,
		filterParams
	}: FindByIdParams<number>): Promise<BannerFromRepository | null> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.banner.findUnique({
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

	async create(data: Prisma.BannerCreateInput): Promise<void> {
		await prisma.banner.create({ data });
	}

	async update({
		id,
		data,
		filterParams
	}: UpdateContentParams<number, Prisma.BannerUpdateInput>): Promise<void> {
		const params = transformValidFilterParams(filterParams);

		await prisma.banner.update({
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
			await prisma.banner.delete({
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
