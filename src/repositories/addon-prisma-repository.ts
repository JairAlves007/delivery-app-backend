import { transformValidFilterParams } from "@/helpers/utils.ts";
import type { IAddonRepository } from "@/interfaces/repositories/addon-repository.ts";
import { prisma } from "@/lib/prisma.ts";
import {
	DeleteContentParams,
	FilterParams,
	FindByIdParams,
	PaginationParams,
	UpdateContentParams
} from "@/types/crud.ts";
import type { Addon, Prisma } from "@prisma/client";

export class AddonPrismaRepository implements IAddonRepository {
	async listAll(filterParams?: FilterParams): Promise<Addon[]> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.addon.findMany({
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

		return await prisma.addon.count({
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
	}: PaginationParams): Promise<Addon[]> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.addon.findMany({
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
	}: FindByIdParams<number>): Promise<Addon | null> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.addon.findUnique({
			where: {
				id,
				deleted_at: null,
				...params
			}
		});
	}

	async create(data: Prisma.AddonCreateInput): Promise<Addon> {
		return await prisma.addon.create({ data });
	}

	async update({
		id,
		filterParams,
		data
	}: UpdateContentParams<number, Prisma.AddonUpdateInput>): Promise<Addon> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.addon.update({
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
	}: DeleteContentParams<number>): Promise<Addon> {
		const params = transformValidFilterParams(filterParams);

		if (force) {
			return await prisma.addon.delete({
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
