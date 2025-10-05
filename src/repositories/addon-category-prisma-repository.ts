import { transformValidFilterParams } from "@/helpers/crud.ts";
import type { IAddonCategoryRepository } from "@/interfaces/repositories/addon-category-repository.ts";
import { prisma } from "@/lib/prisma.ts";
import type { AddonCategoryFromRepository } from "@/types/addon-category.ts";
import type {
	DeleteContentParams,
	FilterParams,
	FindByIdParams,
	PaginationParams,
	UpdateContentParams
} from "@/types/crud.ts";
import type { Prisma } from "@prisma/client";

export class AddonCategoryPrismaRepository implements IAddonCategoryRepository {
	async listAll(
		filterParams?: FilterParams
	): Promise<AddonCategoryFromRepository[]> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.addonCategory.findMany({
			where: {
				deleted_at: null,
				...params
			},
			include: {
				addons: true
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
	}: PaginationParams): Promise<AddonCategoryFromRepository[]> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.addonCategory.findMany({
			skip: (page - 1) * perPage,
			take: perPage,
			where: {
				deleted_at: null,
				...params
			},
			include: {
				addons: true
			},
			orderBy: {
				name: "asc"
			}
		});
	}

	async findById({
		id,
		filterParams
	}: FindByIdParams<number>): Promise<AddonCategoryFromRepository | null> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.addonCategory.findUnique({
			where: {
				id,
				deleted_at: null,
				...params
			},
			include: {
				addons: true
			}
		});
	}

	async create(data: Prisma.AddonCategoryCreateInput): Promise<void> {
		await prisma.addonCategory.create({ data });
	}

	async update({
		id,
		filterParams,
		data
	}: UpdateContentParams<
		number,
		Prisma.AddonCategoryUpdateInput
	>): Promise<void> {
		const params = transformValidFilterParams(filterParams);

		await prisma.addonCategory.update({
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
			await prisma.addonCategory.delete({
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
