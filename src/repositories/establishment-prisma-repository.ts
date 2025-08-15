import type { IEstablishmentRepository } from "@/interfaces/repositories/establishment-repository.ts";
import type { Establishment, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma.ts";

export class EstablishmentPrismaRepository implements IEstablishmentRepository {
	async listAll(): Promise<Establishment[]> {
		return await prisma.establishment.findMany({
			where: {
				deleted_at: null
			},
			orderBy: {
				created_at: "desc"
			}
		});
	}

	async count(): Promise<number> {
		return await prisma.establishment.count({
			where: {
				deleted_at: null
			}
		});
	}

	async paginate(page: number, limit: number): Promise<Establishment[]> {
		return await prisma.establishment.findMany({
			skip: (page - 1) * limit,
			take: limit,
			where: {
				deleted_at: null
			},
			orderBy: {
				created_at: "desc"
			}
		});
	}

	async findById(id: string): Promise<Establishment | null> {
		return await prisma.establishment.findUnique({
			where: {
				id
			}
		});
	}

	async create(data: Prisma.EstablishmentCreateInput): Promise<Establishment> {
		return await prisma.establishment.create({ data });
	}

	async update(
		id: string,
		data: Prisma.EstablishmentUpdateInput
	): Promise<Establishment> {
		return await prisma.establishment.update({
			where: {
				id
			},
			data
		});
	}

	async delete(id: string, force: boolean = false): Promise<Establishment> {
		if (force) {
			return await prisma.establishment.delete({
				where: {
					id
				}
			});
		}

		return await prisma.establishment.update({
			where: {
				id
			},
			data: {
				deleted_at: new Date()
			}
		});
	}
}
