import type { IBannerRepository } from "@/interfaces/repositories/banner-repository.ts";
import { prisma } from "@/lib/prisma.ts";
import type { Banner, Prisma } from "@prisma/client";

export class BannerPrismaRepository implements IBannerRepository {
	async listAll(establishmentId?: string | null): Promise<Banner[]> {
		return await prisma.banner.findMany({
			where: {
				deleted_at: null,
				...(!!establishmentId && { establishment_id: establishmentId })
			},
			orderBy: {
				created_at: "desc"
			}
		});
	}

	async count(establishmentId?: string | null): Promise<number> {
		return await prisma.banner.count({
			where: {
				deleted_at: null,
				...(!!establishmentId && { establishment_id: establishmentId })
			}
		});
	}

	async paginate(
		page: number,
		limit: number,
		establishmentId?: string | null
	): Promise<Banner[]> {
		return await prisma.banner.findMany({
			skip: (page - 1) * limit,
			take: limit,
			where: {
				deleted_at: null,
				...(!!establishmentId && { establishment_id: establishmentId })
			},
			orderBy: {
				created_at: "desc"
			}
		});
	}

	async findById(
		id: number,
		establishmentId?: string | null
	): Promise<Banner | null> {
		return await prisma.banner.findUnique({
			where: {
				id,
				deleted_at: null,
				...(!!establishmentId && { establishment_id: establishmentId })
			}
		});
	}

	async create(data: Prisma.BannerCreateInput): Promise<Banner> {
		return await prisma.banner.create({ data });
	}

	async update(id: number, data: Prisma.BannerUpdateInput): Promise<Banner> {
		return await prisma.banner.update({
			where: {
				id
			},
			data
		});
	}

	async delete(id: number, force: boolean): Promise<Banner> {
		if (force) {
			return await prisma.banner.delete({
				where: {
					id
				}
			});
		}

		return await this.update(id, { deleted_at: new Date() });
	}
}
