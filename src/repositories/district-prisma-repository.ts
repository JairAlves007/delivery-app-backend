import type { District, Prisma } from "@/generated/prisma/client.ts";
import {
	buildFilterQueryOptions,
	transformValidFilterParams
} from "@/helpers/crud.ts";
import type { IDistrictRepository } from "@/interfaces/repositories/district-repository.ts";
import prisma from "@/lib/prisma.ts";
import type {
	DeleteContentParams,
	FilterParams,
	FindByIdParams,
	PaginationParams,
	UpdateContentParams
} from "@/types/crud.ts";

export class DistrictPrismaRepository implements IDistrictRepository {
	async listAll(filterParams?: FilterParams): Promise<District[]> {
		const { search, sortField, sortDirection, ...params } =
			transformValidFilterParams(filterParams);

		const { where, orderBy } =
			buildFilterQueryOptions<Prisma.DistrictOrderByWithRelationInput>({
				search,
				sortField: sortField ?? "name",
				sortDirection: sortDirection ?? "asc",
				searchableFields: ["name"],
				defaultSortField: "name"
			});

		return await prisma.district.findMany({
			where: {
				deleted_at: null,
				...where,
				...params
			},
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

		const { where, orderBy } =
			buildFilterQueryOptions<Prisma.DistrictOrderByWithRelationInput>({
				search,
				sortField,
				sortDirection,
				searchableFields: ["name"],
				defaultSortField: "name"
			});

		return await prisma.district.count({
			where: {
				deleted_at: null,
				...where,
				...params
			},
			orderBy
		});
	}

	async paginate({
		page,
		perPage,
		filterParams
	}: PaginationParams): Promise<District[]> {
		const { search, sortField, sortDirection, ...params } =
			transformValidFilterParams(filterParams);

		const { where, orderBy } =
			buildFilterQueryOptions<Prisma.DistrictOrderByWithRelationInput>({
				search,
				sortField: sortField ?? "name",
				sortDirection: sortDirection ?? "asc",
				searchableFields: ["name"],
				defaultSortField: "name"
			});

		return await prisma.district.findMany({
			skip: (page - 1) * perPage,
			take: perPage,
			where: {
				deleted_at: null,
				...where,
				...params
			},
			orderBy
		});
	}

	async findById({
		id,
		filterParams
	}: FindByIdParams<string>): Promise<District | null> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.district.findUnique({
			where: {
				id,
				deleted_at: null,
				...params
			}
		});
	}

	async create(data: Prisma.DistrictCreateInput): Promise<void> {
		await prisma.district.create({ data });
	}

	async update({
		id,
		data,
		filterParams
	}: UpdateContentParams<string, Prisma.DistrictUpdateInput>): Promise<void> {
		const params = transformValidFilterParams(filterParams);

		await prisma.district.update({
			where: {
				id,
				deleted_at: null,
				...params
			},
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
			await prisma.district.delete({
				where: {
					id,
					...params
				}
			});
		}

		await this.update({
			id,
			filterParams,
			data: { deleted_at: new Date() }
		});
	}
}
