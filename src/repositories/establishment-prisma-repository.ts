import type { IEstablishmentRepository } from "@/interfaces/repositories/establishment-repository.ts";
import type { Establishment, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma.ts";
import type { EstablishmentWithInfo } from "@/types/establishment.ts";
import type {
	DeleteContentParams,
	FindByIdParams,
	PaginationParams,
	UpdateContentParams
} from "@/types/crud.ts";

export class EstablishmentPrismaRepository implements IEstablishmentRepository {
	async listAll(): Promise<EstablishmentWithInfo[]> {
		return await prisma.establishment.findMany({
			where: {
				deleted_at: null
			},
			include: {
				resources: {
					select: {
						resource: true
					}
				},
				socialLinks: true,
				openingHours: true,
				closures: true
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

	async paginate({
		perPage,
		page
	}: PaginationParams): Promise<EstablishmentWithInfo[]> {
		return await prisma.establishment.findMany({
			skip: (page - 1) * perPage,
			take: perPage,
			where: {
				deleted_at: null
			},
			include: {
				resources: {
					select: {
						resource: true
					}
				},
				socialLinks: true,
				openingHours: true,
				closures: true
			},
			orderBy: {
				created_at: "desc"
			}
		});
	}

	async findById({
		id
	}: FindByIdParams<string>): Promise<EstablishmentWithInfo | null> {
		return await prisma.establishment.findUnique({
			where: {
				id,
				deleted_at: null,
				OR: [{ next_billing_date: { gt: new Date() } }]
			},
			include: {
				resources: {
					select: {
						resource: true
					}
				},
				socialLinks: true,
				openingHours: true,
				closures: true
			}
		});
	}

	async findBySlug(slug: string): Promise<EstablishmentWithInfo | null> {
		return await prisma.establishment.findUnique({
			where: {
				slug,
				deleted_at: null,
				OR: [{ next_billing_date: { gt: new Date() } }]
			},
			include: {
				resources: {
					select: {
						resource: true
					}
				},
				socialLinks: true,
				openingHours: true,
				closures: true
			}
		});
	}

	async create(data: Prisma.EstablishmentCreateInput): Promise<void> {
		await prisma.establishment.create({ data });
	}

	async update({
		id,
		data
	}: UpdateContentParams<
		string,
		Prisma.EstablishmentUpdateInput
	>): Promise<void> {
		await prisma.establishment.update({
			where: {
				id,
				deleted_at: null
			},
			data
		});
	}

	async delete({ id, force }: DeleteContentParams<string>): Promise<void> {
		if (force) {
			await prisma.establishment.delete({
				where: {
					id
				}
			});
		}

		await this.update({
			id,
			data: { deleted_at: new Date() }
		});
	}
}
