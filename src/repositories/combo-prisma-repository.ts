import type { Combo, Prisma } from "@/generated/prisma/client.js";
import {
	buildFilterQueryOptions,
	transformValidFilterParams
} from "@/helpers/crud.js";
import type { IComboRepository } from "@/interfaces/repositories/combo-repository.js";
import prisma from "@/lib/prisma.js";
import type { ComboForOrder, ComboWithRelations } from "@/types/combo.js";
import type {
	DeleteContentParams,
	FilterParams,
	FindByIdParams,
	PaginationParams,
	UpdateContentParams
} from "@/types/crud.js";
import type { EstablishmentID } from "@/types/establishment.js";

const relationsInclude = {
	items: { include: { product: { select: { id: true, name: true, price: true } } } },
	groups: {
		include: {
			options: {
				include: { product: { select: { id: true, name: true, price: true } } }
			}
		}
	},
	resources: { include: { resource: true } }
} satisfies Prisma.ComboInclude;

export class ComboPrismaRepository implements IComboRepository {
	async listAll(filterParams?: FilterParams): Promise<Combo[]> {
		const { search, sortField, sortDirection, ...params } =
			transformValidFilterParams(filterParams);

		const { where, orderBy } =
			buildFilterQueryOptions<Prisma.ComboOrderByWithRelationInput>({
				search,
				sortField: sortField ?? "id",
				sortDirection: sortDirection ?? "asc",
				searchableFields: ["name"],
				defaultSortField: "id"
			});

		return await prisma.combo.findMany({
			where: { deleted_at: null, ...where, ...params },
			orderBy
		});
	}

	async count(filterParams?: FilterParams): Promise<number> {
		const {
			search,
			sortField = undefined,
			sortDirection = undefined,
			...params
		} = transformValidFilterParams(filterParams);

		const { where } =
			buildFilterQueryOptions<Prisma.ComboOrderByWithRelationInput>({
				search,
				sortField,
				sortDirection,
				searchableFields: ["name"],
				defaultSortField: "id"
			});

		return await prisma.combo.count({
			where: { deleted_at: null, ...where, ...params }
		});
	}

	async paginate({
		perPage,
		page,
		filterParams
	}: PaginationParams): Promise<Combo[]> {
		const { search, sortField, sortDirection, ...params } =
			transformValidFilterParams(filterParams);

		const { where, orderBy } =
			buildFilterQueryOptions<Prisma.ComboOrderByWithRelationInput>({
				search,
				sortField: sortField ?? "id",
				sortDirection: sortDirection ?? "asc",
				searchableFields: ["name"],
				defaultSortField: "id"
			});

		return await prisma.combo.findMany({
			skip: (page - 1) * perPage,
			take: perPage,
			where: { deleted_at: null, ...where, ...params },
			orderBy
		});
	}

	async findById({
		id,
		filterParams
	}: FindByIdParams<string>): Promise<Combo | null> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.combo.findUnique({
			where: { id, deleted_at: null, ...params }
		});
	}

	async findByIdWithRelations({
		id,
		filterParams
	}: FindByIdParams<string>): Promise<ComboWithRelations | null> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.combo.findUnique({
			where: { id, deleted_at: null, ...params },
			include: relationsInclude
		});
	}

	async findActiveByEstablishment(
		establishmentId: EstablishmentID
	): Promise<ComboWithRelations[]> {
		const now = new Date();

		return await prisma.combo.findMany({
			where: {
				establishment_id: establishmentId,
				deleted_at: null,
				is_active: true,
				OR: [{ valid_until: null }, { valid_until: { gt: now } }]
			},
			include: relationsInclude,
			orderBy: { order: "asc" }
		});
	}

	async findByIdForOrder(
		id: string,
		establishmentId: EstablishmentID
	): Promise<ComboForOrder | null> {
		return await prisma.combo.findFirst({
			where: { id, establishment_id: establishmentId, deleted_at: null },
			include: {
				items: { include: { product: { select: { id: true, name: true } } } },
				groups: {
					include: {
						options: {
							include: { product: { select: { id: true, name: true } } }
						}
					}
				}
			}
		});
	}

	async create(data: Prisma.ComboCreateInput): Promise<void> {
		await prisma.combo.create({ data });
	}

	async update({
		id,
		data,
		filterParams
	}: UpdateContentParams<string, Prisma.ComboUpdateInput>): Promise<void> {
		const params = transformValidFilterParams(filterParams);

		await prisma.combo.update({
			where: { id, deleted_at: null, ...params },
			data
		});
	}

	async delete({
		id,
		force,
		filterParams
	}: DeleteContentParams<string>): Promise<void> {
		const params = transformValidFilterParams(filterParams);

		if (force) {
			await prisma.combo.delete({ where: { id, ...params } });
		}

		await this.update({ id, filterParams, data: { deleted_at: new Date() } });
	}
}
