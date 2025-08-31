import type { IAddonCategoryRepository } from "@/interfaces/repositories/addon-category-repository.ts";
import { prisma } from "@/lib/prisma.ts";
import type { AddonCategory, Prisma } from "@prisma/client";

export class AddonCategoryPrismaRepository implements IAddonCategoryRepository {
	async listAll(): Promise<AddonCategory[]> {
		return await prisma.addonCategory.findMany({
			where: {
				deleted_at: null
			},
			orderBy: {
				name: "asc"
			}
		});
	}

	async count(): Promise<number> {
		return await prisma.addonCategory.count({
			where: {
				deleted_at: null
			}
		});
	}

	async paginate(page: number, limit: number): Promise<AddonCategory[]> {
		return await prisma.addonCategory.findMany({
			skip: (page - 1) * limit,
			take: limit,
			where: {
				deleted_at: null
			},
			orderBy: {
				name: "asc"
			}
		});
	}

	async findById(id: number): Promise<AddonCategory | null> {
		return await prisma.addonCategory.findUnique({
			where: {
				id,
				deleted_at: null
			}
		});
	}

	async create(data: Prisma.AddonCategoryCreateInput): Promise<AddonCategory> {
		return await prisma.addonCategory.create({ data });
	}

	async update(
		id: number,
		data: Prisma.AddonCategoryUpdateInput
	): Promise<AddonCategory> {
		return await prisma.addonCategory.update({
			where: {
				id,
				deleted_at: null
			},
			data
		});
	}

	async delete(id: number, force: boolean): Promise<AddonCategory> {
		if (force) {
			return await prisma.addonCategory.delete({
				where: {
					id
				}
			});
		}

		return await this.update(id, { deleted_at: new Date() });
	}
}
