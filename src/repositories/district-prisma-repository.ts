import type { IDistrictRepository } from "@/interfaces/repositories/district-repository.ts";
import { prisma } from "@/lib/prisma.ts";
import type { District, Prisma } from "@prisma/client";

export class DistrictPrismaRepository implements IDistrictRepository {
	async listAll(establishmentId?: string | null): Promise<District[]> {
		return await prisma.district.findMany({
			where: {
				deleted_at: null,
				...(!!establishmentId && { establishment_id: establishmentId })
			},
			orderBy: {
				name: "asc"
			}
		});
	}

	async count(establishmentId?: string | null): Promise<number> {
		return await prisma.district.count({
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
	): Promise<District[]> {
		return await prisma.district.findMany({
			skip: (page - 1) * limit,
			take: limit,
			where: {
				deleted_at: null,
				...(!!establishmentId && { establishment_id: establishmentId })
			},
			orderBy: {
				name: "asc"
			}
		});
	}

	async findById(
		id: number,
		establishmentId?: string | null
	): Promise<District | null> {
		return await prisma.district.findUnique({
			where: {
				id,
				deleted_at: null,
				...(!!establishmentId && { establishment_id: establishmentId })
			}
		});
	}

	async create(data: Prisma.DistrictCreateInput): Promise<District> {
		return await prisma.district.create({ data });
	}

	async update(
		id: number,
		data: Prisma.DistrictUpdateInput
	): Promise<District> {
		return await prisma.district.update({
			where: {
				id,
				deleted_at: null
			},
			data
		});
	}

	async delete(id: number, force: boolean): Promise<District> {
		if (force) {
			return await prisma.district.delete({
				where: {
					id
				}
			});
		}

		return await this.update(id, { deleted_at: new Date() });
	}
}
