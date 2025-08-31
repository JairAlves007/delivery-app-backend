import type { IAddonRepository } from "@/interfaces/repositories/addon-repository.ts";
import { prisma } from "@/lib/prisma.ts";
import type { Addon, Prisma } from "@prisma/client";

export class AddonPrismaRepository implements IAddonRepository {
	async listAll(): Promise<Addon[]> {
		return await prisma.addon.findMany({
			where: {
				deleted_at: null
			},
			orderBy: {
				name: "asc"
			}
		});
	}

	async count(): Promise<number> {
		return await prisma.addon.count({
			where: {
				deleted_at: null
			}
		});
	}

	async paginate(page: number, limit: number): Promise<Addon[]> {
		return await prisma.addon.findMany({
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

	async findById(id: number): Promise<Addon | null> {
		return await prisma.addon.findUnique({
			where: {
				id,
				deleted_at: null
			}
		});
	}

	async create(data: Prisma.AddonCreateInput): Promise<Addon> {
		return await prisma.addon.create({ data });
	}

	async update(id: number, data: Prisma.AddonUpdateInput): Promise<Addon> {
		return await prisma.addon.update({
			where: {
				id,
				deleted_at: null
			},
			data
		});
	}

	async delete(id: number, force: boolean): Promise<Addon> {
		if (force) {
			return await prisma.addon.delete({
				where: {
					id
				}
			});
		}

		return await this.update(id, { deleted_at: new Date() });
	}
}
