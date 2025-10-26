import {
	buildFilterQueryOptions,
	transformValidFilterParams
} from "@/helpers/crud.ts";
import type { IEstablishmentRepository } from "@/interfaces/repositories/establishment-repository.ts";
import { prisma } from "@/lib/prisma.ts";
import type {
	DeleteContentParams,
	FilterParams,
	FindByIdParams,
	PaginationParams,
	UpdateContentParams
} from "@/types/crud.ts";
import type { EstablishmentFromRepository } from "@/types/establishment.ts";
import type { Prisma } from "@prisma/client";

export class EstablishmentPrismaRepository implements IEstablishmentRepository {
	async listAll(
		filterParams?: FilterParams
	): Promise<EstablishmentFromRepository[]> {
		const { search, sortField, sortOrder } =
			transformValidFilterParams(filterParams);

		const { where, orderBy } =
			buildFilterQueryOptions<Prisma.EstablishmentOrderByWithRelationInput>({
				search,
				sortField: sortField ?? "created_at",
				sortOrder: sortOrder ?? "desc",
				searchableFields: ["name", "cnpj", "description", "email"],
				defaultSortField: "created_at"
			});

		return await prisma.establishment.findMany({
			where: {
				deleted_at: null,
				...where
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
			orderBy
		});
	}

	async count(filterParams?: FilterParams): Promise<number> {
		const { search } = transformValidFilterParams(filterParams);

		const { where } =
			buildFilterQueryOptions<Prisma.EstablishmentOrderByWithRelationInput>({
				search,
				sortField: undefined,
				sortOrder: undefined,
				searchableFields: ["name", "cnpj", "description", "email"],
				defaultSortField: "created_at"
			});

		return await prisma.establishment.count({
			where: {
				deleted_at: null,
				...where
			}
		});
	}

	async paginate({
		perPage,
		page,
		filterParams
	}: PaginationParams): Promise<EstablishmentFromRepository[]> {
		const { search, sortField, sortOrder } =
			transformValidFilterParams(filterParams);

		const { where, orderBy } =
			buildFilterQueryOptions<Prisma.EstablishmentOrderByWithRelationInput>({
				search,
				sortField: sortField ?? "created_at",
				sortOrder: sortOrder ?? "desc",
				searchableFields: ["name", "cnpj", "description", "email"],
				defaultSortField: "created_at"
			});

		return await prisma.establishment.findMany({
			skip: (page - 1) * perPage,
			take: perPage,
			where: {
				deleted_at: null,
				...where
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
			orderBy
		});
	}

	async findById({
		id
	}: FindByIdParams<string>): Promise<EstablishmentFromRepository | null> {
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

	async findBySlug(slug: string): Promise<EstablishmentFromRepository | null> {
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
