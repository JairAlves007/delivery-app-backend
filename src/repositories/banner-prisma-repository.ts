import { transformValidFilterParams } from "@/helpers/utils.ts";
import type { IBannerRepository } from "@/interfaces/repositories/banner-repository.ts";
import { prisma } from "@/lib/prisma.ts";
import type {
	DeleteContentParams,
	FilterParams,
	FindByIdParams,
	PaginationParams,
	UpdateContentParams
} from "@/types/crud.ts";
import type { Banner, Prisma } from "@prisma/client";

export class BannerPrismaRepository implements IBannerRepository {
	async listAll(filterParams?: FilterParams): Promise<Banner[]> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.banner.findMany({
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
	}: PaginationParams): Promise<Banner[]> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.banner.findMany({
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

	async findById({
		id,
		filterParams
	}: FindByIdParams<number>): Promise<Banner | null> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.banner.findUnique({
			where: {
				id,
				deleted_at: null,
				...params
			}
		});
	}

	async create(data: Prisma.BannerCreateInput): Promise<Banner> {
		return await prisma.banner.create({ data });
	}

	async update({
		id,
		data,
		filterParams
	}: UpdateContentParams<number, Prisma.BannerUpdateInput>): Promise<Banner> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.banner.update({
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
	}: DeleteContentParams<number>): Promise<Banner> {
		const params = transformValidFilterParams(filterParams);

		if (force) {
			return await prisma.banner.delete({
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
}
