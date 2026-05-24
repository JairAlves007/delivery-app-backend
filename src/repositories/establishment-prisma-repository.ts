import type { Establishment, Prisma } from "@/generated/prisma/client.js";
import {
	buildFilterQueryOptions,
	transformValidFilterParams
} from "@/helpers/crud.js";
import type {
	IEstablishmentRepository,
	OpeningHourInputItem,
	SocialLinkUpsertItem
} from "@/interfaces/repositories/establishment-repository.js";
import prisma from "@/lib/prisma.js";
import type {
	DeleteContentParams,
	FilterParams,
	FindByIdParams,
	PaginationParams,
	UpdateContentParams
} from "@/types/crud.js";
import type { EstablishmentFromRepository } from "@/types/establishment.js";

export class EstablishmentPrismaRepository implements IEstablishmentRepository {
	async listAll(
		filterParams?: FilterParams
	): Promise<EstablishmentFromRepository[]> {
		const { search, sortField, sortDirection } =
			transformValidFilterParams(filterParams);

		const { where, orderBy } =
			buildFilterQueryOptions<Prisma.EstablishmentOrderByWithRelationInput>({
				search,
				sortField: sortField ?? "created_at",
				sortDirection: sortDirection ?? "desc",
				searchableFields: ["name", "cnpj", "description", "email"],
				defaultSortField: "created_at"
			});

		return await prisma.establishment.findMany({
			where: {
				deleted_at: null,
				...where
			},
			include: {
				address: {
					select: {
						address: true
					}
				},
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
				sortDirection: undefined,
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
		const { search, sortField, sortDirection } =
			transformValidFilterParams(filterParams);

		const { where, orderBy } =
			buildFilterQueryOptions<Prisma.EstablishmentOrderByWithRelationInput>({
				search,
				sortField: sortField ?? "created_at",
				sortDirection: sortDirection ?? "desc",
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
				address: {
					select: {
						address: true
					}
				},
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
				address: {
					select: {
						address: true
					}
				},
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
				address: {
					select: {
						address: true
					}
				},
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

	async create(data: Prisma.EstablishmentCreateInput): Promise<Establishment> {
		return await prisma.establishment.create({ data });
	}

	async update({
		id,
		data
	}: UpdateContentParams<
		string,
		Prisma.EstablishmentUpdateInput
	>): Promise<Establishment> {
		return await prisma.establishment.update({
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

	async replaceOpeningHours({
		establishmentId,
		items
	}: {
		establishmentId: string;
		items: OpeningHourInputItem[];
	}): Promise<void> {
		await prisma.$transaction([
			prisma.openingHour.deleteMany({
				where: { establishment_id: establishmentId }
			}),
			...(items.length > 0
				? [
						prisma.openingHour.createMany({
							data: items.map(item => ({
								establishment_id: establishmentId,
								...item
							}))
						})
					]
				: [])
		]);
	}

	async upsertSocialLinks({
		establishmentId,
		items
	}: {
		establishmentId: string;
		items: SocialLinkUpsertItem[];
	}): Promise<void> {
		if (items.length === 0) return;

		const toDelete = items.filter(item => item.url === null);
		const toUpsert = items.filter(
			(item): item is { platform: SocialLinkUpsertItem["platform"]; url: string } =>
				item.url !== null
		);

		await prisma.$transaction([
			...(toDelete.length > 0
				? [
						prisma.socialLink.deleteMany({
							where: {
								establishment_id: establishmentId,
								platform: { in: toDelete.map(item => item.platform) }
							}
						})
					]
				: []),
			...toUpsert.map(item =>
				prisma.socialLink.upsert({
					where: {
						platform_establishment_id: {
							platform: item.platform,
							establishment_id: establishmentId
						}
					},
					create: {
						platform: item.platform,
						url: item.url,
						establishment_id: establishmentId
					},
					update: { url: item.url }
				})
			)
		]);
	}
}
