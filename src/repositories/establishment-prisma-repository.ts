import { IEstablishmentRepository } from "@/interfaces/repositories/establishment-repository";
import { prisma } from "@/lib/prisma";
import { Establishment, Prisma } from "@prisma/client";

export class EstablishmentPrismaRepository implements IEstablishmentRepository {
	async listAll(): Promise<Establishment[]> {
		return await prisma.establishment.findMany({
			orderBy: {
				created_at: "desc"
			}
		});
	}

	async count(): Promise<number> {
		return await prisma.establishment.count();
	}

	async paginate(page: number, limit: number): Promise<Establishment[]> {
		return await prisma.establishment.findMany({
			skip: (page - 1) * limit,
			take: limit,
			orderBy: {
				created_at: "desc"
			}
		});
	}

	async findById(id: string): Promise<Establishment | null> {
		throw new Error("Method not implemented.");
	}

	async create(data: Prisma.EstablishmentCreateInput): Promise<Establishment> {
		throw new Error("Method not implemented.");
	}

	async update(data: Prisma.EstablishmentUpdateInput): Promise<Establishment> {
		throw new Error("Method not implemented.");
	}

	async delete(id: string): Promise<Establishment> {
		throw new Error("Method not implemented.");
	}
}
