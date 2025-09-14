import { makeCache } from "@/factories/services/cache/make-cache.ts";
import type { IProductRepository } from "@/interfaces/repositories/product-repository.ts";
import { establishmentParamsSchema } from "@/schemas/establishment-schema.ts";
import { listCursorQueryParamsSchema } from "@/schemas/generic-schema.ts";
import type { Product } from "@prisma/client";
import z from "zod";

type ListEstablishmentCatalogServiceRequest = z.infer<
	typeof listCursorQueryParamsSchema
> &
	z.infer<typeof establishmentParamsSchema>;

interface ListEstablishmentCatalogServiceResponse {
	catalog: Product[];
	pagination: {
		nextCursor: string | null;
		hasNextPage: boolean;
	};
}

export class ListEstablishmentCatalogService {
	private productRepository: IProductRepository;

	constructor(productRepository: IProductRepository) {
		this.productRepository = productRepository;
	}

	public async handle({
		id,
		limit,
		cursor
	}: ListEstablishmentCatalogServiceRequest): Promise<ListEstablishmentCatalogServiceResponse> {
		const cache = makeCache();
		const cursorSuffix = cursor ? `_cursor_${cursor}` : "";

		const catalog = await cache.rememberForever(
			`${cache.keys.establishments}_${id}_limit_${limit}${cursorSuffix}`,
			async () => await this.productRepository.getCatalog(id, limit, cursor)
		);
		const nextCursor =
			catalog.length > 0 ? catalog[catalog.length - 1].id : null;

		return {
			catalog,
			pagination: {
				nextCursor,
				hasNextPage: !!nextCursor
			}
		};
	}
}
