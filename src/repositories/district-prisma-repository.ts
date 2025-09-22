import { transformValidFilterParams } from "@/helpers/utils.ts";
import type { IDistrictRepository } from "@/interfaces/repositories/district-repository.ts";
import { prisma } from "@/lib/prisma.ts";
import type {
	DeleteContentParams,
	FilterParams,
	FindByIdParams,
	PaginationParams,
	UpdateContentParams
} from "@/types/crud.ts";
import type { District, Prisma } from "@prisma/client";

export class DistrictPrismaRepository implements IDistrictRepository {
	async listAll(filterParams?: FilterParams): Promise<District[]> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.district.findMany({
			where: {
				deleted_at: null,
				...params
			},
			orderBy: {
				name: "asc"
			}
		});
	}

	async count(filterParams?: FilterParams): Promise<number> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.district.count({
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
	}: PaginationParams): Promise<District[]> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.district.findMany({
			skip: (page - 1) * perPage,
			take: perPage,
			where: {
				deleted_at: null,
				...params
			},
			orderBy: {
				name: "asc"
			}
		});
	}

	async findById({
		id,
		filterParams
	}: FindByIdParams<string>): Promise<District | null> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.district.findUnique({
			where: {
				id,
				deleted_at: null,
				...params
			}
		});
	}

	async create(data: Prisma.DistrictCreateInput): Promise<District> {
		return await prisma.district.create({ data });
	}

	async update({
		id,
		data,
		filterParams
	}: UpdateContentParams<
		string,
		Prisma.DistrictUpdateInput
	>): Promise<District> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.district.update({
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
	}: DeleteContentParams<string>): Promise<District> {
		const params = transformValidFilterParams(filterParams);

		if (force) {
			return await prisma.district.delete({
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
