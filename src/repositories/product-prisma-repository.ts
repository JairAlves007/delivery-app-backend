import { Prisma } from "@/generated/prisma/client.js";
import {
	buildFilterQueryOptions,
	transformValidFilterParams
} from "@/helpers/crud.js";
import type {
	IProductRepository,
	SearchCatalogParams
} from "@/interfaces/repositories/product-repository.js";
import prisma from "@/lib/prisma.js";
import type {
	CursorPaginationParams,
	DeleteContentParams,
	FilterParams,
	FindByIdParams,
	PaginationParams,
	UpdateContentParams
} from "@/types/crud.js";
import type { EstablishmentID } from "@/types/establishment.js";
import type { ProductFromRepository } from "@/types/product.js";

export class ProductPrismaRepository implements IProductRepository {
	async listAll(filterParams?: FilterParams): Promise<ProductFromRepository[]> {
		const { search, sortField, sortDirection, ...params } =
			transformValidFilterParams(filterParams);

		const { where, orderBy } =
			buildFilterQueryOptions<Prisma.ProductOrderByWithRelationInput>({
				search,
				sortField: sortField ?? "created_at",
				sortDirection: sortDirection ?? "desc",
				searchableFields: ["name", "description"],
				defaultSortField: "created_at"
			});

		return await prisma.product.findMany({
			where: {
				deleted_at: null,
				...where,
				...params
			},
			include: {
				resources: {
					select: {
						resource: true
					}
				},
				tags: {
					select: {
						tag: true
					}
				}
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

		const { where } =
			buildFilterQueryOptions<Prisma.ProductOrderByWithRelationInput>({
				search,
				sortField,
				sortDirection,
				searchableFields: ["name", "description"],
				defaultSortField: "created_at"
			});

		return await prisma.product.count({
			where: {
				deleted_at: null,
				...where,
				...params
			}
		});
	}

	async paginate({
		perPage,
		page,
		filterParams
	}: PaginationParams): Promise<ProductFromRepository[]> {
		const { search, sortField, sortDirection, ...params } =
			transformValidFilterParams(filterParams);

		const { where, orderBy } =
			buildFilterQueryOptions<Prisma.ProductOrderByWithRelationInput>({
				search,
				sortField: sortField ?? "created_at",
				sortDirection: sortDirection ?? "desc",
				searchableFields: ["name", "description"],
				defaultSortField: "created_at"
			});

		return await prisma.product.findMany({
			skip: (page - 1) * perPage,
			take: perPage,
			where: {
				deleted_at: null,
				...where,
				...params
			},
			include: {
				resources: {
					select: {
						resource: true
					}
				},
				tags: {
					select: {
						tag: true
					}
				}
			},
			orderBy
		});
	}

	async cursorPaginate({
		limit,
		cursor,
		filterParams
	}: CursorPaginationParams<string>): Promise<ProductFromRepository[]> {
		const { search, sortField, sortDirection, ...params } =
			transformValidFilterParams(filterParams);

		const { where, orderBy } =
			buildFilterQueryOptions<Prisma.ProductOrderByWithRelationInput>({
				search,
				sortField: sortField ?? "created_at",
				sortDirection: sortDirection ?? "desc",
				searchableFields: ["name", "description"],
				defaultSortField: "created_at"
			});

		return await prisma.product.findMany({
			where: {
				deleted_at: null,
				...where,
				...params
			},
			include: {
				resources: {
					select: {
						resource: true
					}
				},
				tags: {
					select: {
						tag: true
					}
				}
			},
			orderBy,
			take: limit + 1,
			skip: cursor ? 1 : 0,
			cursor: cursor ? { id: cursor } : undefined
		});
	}

	async findById({
		id,
		filterParams
	}: FindByIdParams<string>): Promise<ProductFromRepository | null> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.product.findUnique({
			where: {
				id,
				deleted_at: null,
				...params
			},
			include: {
				resources: {
					select: {
						resource: true
					}
				},
				tags: {
					select: {
						tag: true
					}
				}
			}
		});
	}

	async create(data: Prisma.ProductCreateInput): Promise<void> {
		await prisma.product.create({ data });
	}

	async update({
		id,
		data,
		filterParams
	}: UpdateContentParams<string, Prisma.ProductUpdateInput>): Promise<void> {
		const params = transformValidFilterParams(filterParams);

		await prisma.product.update({
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
			await prisma.product.delete({
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

	async findSuggested({
		productId,
		establishmentId,
		limit
	}: {
		productId: string;
		establishmentId: EstablishmentID;
		limit: number;
	}): Promise<ProductFromRepository[]> {
		// 1. Recomendações explícitas (AUTO antes de MANUAL, score desc)
		const recommendations = await prisma.productRecommendation.findMany({
			where: { product_id: productId, establishment_id: establishmentId },
			orderBy: [{ source: "asc" }, { score: "desc" }],
			select: { recommended_product_id: true },
			take: limit
		});

		const orderedIds: string[] = recommendations.map(
			r => r.recommended_product_id
		);

		// 2. Fallback por combinação de tags, preenchendo o restante
		if (orderedIds.length < limit) {
			const currentTags = await prisma.productTag.findMany({
				where: { product_id: productId },
				select: { tag_id: true }
			});

			const tagIds = currentTags.map(t => t.tag_id);

			if (tagIds.length > 0) {
				const combinations = await prisma.tagCombination.findMany({
					where: { from_tag_id: { in: tagIds } },
					select: { to_tag_id: true }
				});

				const suggestedTagIds = Array.from(
					new Set(combinations.map(c => c.to_tag_id))
				);

				if (suggestedTagIds.length > 0) {
					const fallback = await prisma.product.findMany({
						where: {
							deleted_at: null,
							establishment_id: establishmentId,
							id: { not: productId, notIn: orderedIds },
							tags: { some: { tag_id: { in: suggestedTagIds } } },
							OR: [{ valid_until: null }, { valid_until: { gt: new Date() } }]
						},
						select: { id: true },
						take: limit - orderedIds.length
					});

					orderedIds.push(...fallback.map(p => p.id));
				}
			}
		}

		if (orderedIds.length === 0) return [];

		// 3. Carrega os produtos válidos e reordena pela relevância
		const products = await prisma.product.findMany({
			where: {
				id: { in: orderedIds },
				deleted_at: null,
				establishment_id: establishmentId,
				OR: [{ valid_until: null }, { valid_until: { gt: new Date() } }]
			},
			include: {
				resources: { select: { resource: true } },
				tags: { select: { tag: true } }
			}
		});

		const productById = new Map(products.map(p => [p.id, p]));

		return orderedIds
			.map(id => productById.get(id))
			.filter((product): product is ProductFromRepository => Boolean(product))
			.slice(0, limit);
	}

	async deleteOldTags(id: string): Promise<void> {
		await prisma.productTag.deleteMany({
			where: {
				product_id: id
			}
		});
	}

	async deleteOldProductAddonCategories(id: string): Promise<void> {
		await prisma.productAddonCategory.deleteMany({
			where: {
				product_id: id
			}
		});
	}

	async searchCatalog({
		establishmentId,
		categoryId,
		search,
		page,
		perPage,
		similarityThreshold
	}: SearchCatalogParams): Promise<ProductFromRepository[]> {
		const { searchSql, rankingSql } =
			buildFilterQueryOptions<Prisma.ProductOrderByWithRelationInput>({
				search,
				searchableFields: ["name", "description"],
				defaultSortField: "created_at",
				useUnaccent: true,
				similarityThreshold
			});

		if (!searchSql || !rankingSql) return [];

		const offset = (page - 1) * perPage;

		const rows = await prisma.$queryRaw<{ id: string }[]>`
			SELECT p.id
			FROM products p
			WHERE p.deleted_at IS NULL
				AND p.establishment_id = ${establishmentId}
				${
					categoryId
						? Prisma.sql`AND p.category_id = ${categoryId}`
						: Prisma.empty
				}
				AND ${searchSql}
			ORDER BY ${rankingSql} DESC,
				p.created_at DESC,
				p.id ASC
			LIMIT ${perPage}
			OFFSET ${offset}
		`;

		if (rows.length === 0) return [];

		const ids = rows.map(r => r.id);

		const products = await prisma.product.findMany({
			where: { id: { in: ids } },
			include: {
				resources: { select: { resource: true } },
				tags: { select: { tag: true } }
			}
		});

		const byId = new Map(products.map(p => [p.id, p]));
		return ids
			.map(id => byId.get(id))
			.filter((p): p is ProductFromRepository => !!p);
	}

	async countSearchCatalog({
		establishmentId,
		categoryId,
		search,
		similarityThreshold
	}: Omit<SearchCatalogParams, "page" | "perPage">): Promise<number> {
		const { searchSql } =
			buildFilterQueryOptions<Prisma.ProductOrderByWithRelationInput>({
				search,
				searchableFields: ["name", "description"],
				defaultSortField: "created_at",
				useUnaccent: true,
				similarityThreshold
			});

		if (!searchSql) return 0;

		const rows = await prisma.$queryRaw<{ count: bigint }[]>`
			SELECT COUNT(*)::bigint AS count
			FROM products p
			WHERE p.deleted_at IS NULL
				AND p.establishment_id = ${establishmentId}
				${
					categoryId
						? Prisma.sql`AND p.category_id = ${categoryId}`
						: Prisma.empty
				}
				AND ${searchSql}
		`;

		return Number(rows[0]?.count ?? 0);
	}
}
