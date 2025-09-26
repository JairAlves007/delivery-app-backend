import { transformValidFilterParams } from "@/helpers/crud.ts";
import type { IAddonCategoryRepository } from "@/interfaces/repositories/addon-category-repository.ts";
import { prisma } from "@/lib/prisma.ts";
import type {
	DeleteContentParams,
	FilterParams,
	FindByIdParams,
	PaginationParams,
	UpdateContentParams
} from "@/types/crud.ts";
import type { AddonCategory, Prisma } from "@prisma/client";

export class AddonCategoryPrismaRepository implements IAddonCategoryRepository {
	async listAll(filterParams?: FilterParams): Promise<AddonCategory[]> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.addonCategory.findMany({
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

		return await prisma.addonCategory.count({
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
	}: PaginationParams): Promise<AddonCategory[]> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.addonCategory.findMany({
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
	}: FindByIdParams<number>): Promise<AddonCategory | null> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.addonCategory.findUnique({
			where: {
				id,
				deleted_at: null,
				...params
			}
		});
	}

	async create(data: Prisma.AddonCategoryCreateInput): Promise<AddonCategory> {
		return await prisma.addonCategory.create({ data });
	}

	async update({
		id,
		filterParams,
		data
	}: UpdateContentParams<
		number,
		Prisma.AddonCategoryUpdateInput
	>): Promise<AddonCategory> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.addonCategory.update({
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
	}: DeleteContentParams<number>): Promise<AddonCategory> {
		const params = transformValidFilterParams(filterParams);

		if (force) {
			return await prisma.addonCategory.delete({
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
