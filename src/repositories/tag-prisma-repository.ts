import type { Prisma } from "@/generated/prisma/client.js";
import {
	buildFilterQueryOptions,
	transformValidFilterParams
} from "@/helpers/crud.js";
import type { ITagRepository } from "@/interfaces/repositories/tag-repository.js";
import prisma from "@/lib/prisma.js";
import type {
	DeleteContentParams,
	FilterParams,
	FindByIdParams,
	PaginationParams,
	UpdateContentParams
} from "@/types/crud.js";
import type { TagWithCombinationsFromRepository } from "@/types/tag.js";

const tagInclude = {
	fromTags: {
		where: { to_tag: { deleted_at: null } },
		include: { to_tag: true }
	}
} satisfies Prisma.TagInclude;

export class TagPrismaRepository implements ITagRepository {
	async listAll(
		filterParams?: FilterParams
	): Promise<TagWithCombinationsFromRepository[]> {
		const { search, sortField, sortDirection, ...params } =
			transformValidFilterParams(filterParams);

		const { where, orderBy } =
			buildFilterQueryOptions<Prisma.TagOrderByWithRelationInput>({
				search,
				sortField,
				sortDirection,
				searchableFields: ["label", "type"],
				defaultSortField: "label"
			});

		return await prisma.tag.findMany({
			where: {
				deleted_at: null,
				...where,
				...params
			},
			include: tagInclude,
			orderBy
		});
	}

	async count(filterParams?: FilterParams): Promise<number> {
		const { search, sortField, sortDirection, ...params } =
			transformValidFilterParams(filterParams);

		const { where } =
			buildFilterQueryOptions<Prisma.TagOrderByWithRelationInput>({
				search,
				sortField,
				sortDirection,
				searchableFields: ["label", "type"],
				defaultSortField: "label"
			});

		return await prisma.tag.count({
			where: {
				deleted_at: null,
				...where,
				...params
			}
		});
	}

	async paginate({
		page,
		perPage,
		filterParams
	}: PaginationParams): Promise<TagWithCombinationsFromRepository[]> {
		const { search, sortField, sortDirection, ...params } =
			transformValidFilterParams(filterParams);

		const { where, orderBy } =
			buildFilterQueryOptions<Prisma.TagOrderByWithRelationInput>({
				search,
				sortField,
				sortDirection,
				searchableFields: ["label", "type"],
				defaultSortField: "label"
			});

		return await prisma.tag.findMany({
			skip: (page - 1) * perPage,
			take: perPage,
			where: {
				deleted_at: null,
				...where,
				...params
			},
			include: tagInclude,
			orderBy
		});
	}

	async findById({
		id,
		filterParams
	}: FindByIdParams<number>): Promise<TagWithCombinationsFromRepository | null> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.tag.findFirst({
			where: {
				id,
				deleted_at: null,
				...params
			},
			include: tagInclude
		});
	}

	async create(
		data: Prisma.TagCreateInput
	): Promise<TagWithCombinationsFromRepository> {
		return await prisma.tag.create({ data, include: tagInclude });
	}

	async update({
		id,
		data,
		filterParams
	}: UpdateContentParams<
		number,
		Prisma.TagUpdateInput
	>): Promise<TagWithCombinationsFromRepository> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.tag.update({
			where: {
				id,
				deleted_at: null,
				...params
			},
			data,
			include: tagInclude
		});
	}

	async delete({
		id,
		force,
		filterParams
	}: DeleteContentParams<number>): Promise<void> {
		const params = transformValidFilterParams(filterParams);

		if (force) {
			await prisma.tag.delete({
				where: {
					id,
					...params
				}
			});
			return;
		}

		await this.update({
			id,
			filterParams,
			data: { deleted_at: new Date() }
		});
	}

	async syncCombinations({
		tagId,
		combinableTagIds,
		establishmentId
	}: {
		tagId: number;
		combinableTagIds: number[];
		establishmentId: string;
	}): Promise<void> {
		const validTags = await prisma.tag.findMany({
			where: {
				id: { in: combinableTagIds },
				establishment_id: establishmentId,
				deleted_at: null
			},
			select: { id: true }
		});

		const validIds = validTags.map(t => t.id).filter(id => id !== tagId);

		await prisma.$transaction([
			prisma.tagCombination.deleteMany({
				where: {
					OR: [{ from_tag_id: tagId }, { to_tag_id: tagId }]
				}
			}),
			prisma.tagCombination.createMany({
				data: validIds.flatMap(otherId => [
					{ from_tag_id: tagId, to_tag_id: otherId },
					{ from_tag_id: otherId, to_tag_id: tagId }
				]),
				skipDuplicates: true
			})
		]);
	}
}
