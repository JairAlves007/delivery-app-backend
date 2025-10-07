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
		id: establishmentId,
		limit,
		cursor
	}: ListEstablishmentCatalogServiceRequest): Promise<ListEstablishmentCatalogServiceResponse> {
		const cache = makeCache();
		const cursorSuffix = cursor ? `_cursor_${cursor}` : "";
		const key = `${cache.keys.establishments}_${establishmentId}_limit_${limit}${cursorSuffix}`;

		const raw = await cache.rememberForever(
			key,
			async () =>
				await this.productRepository.cursorPaginate({
					limit,
					cursor,
					filterParams: { establishment_id: establishmentId }
				})
		);
		const hasNextPage = raw.length > limit;
		const catalog = hasNextPage ? raw.slice(0, limit) : raw;
		const nextCursor = hasNextPage ? catalog[catalog.length - 1].id : null;

		if (catalog.length <= 0) await cache.forget(key);

		return {
			catalog,
			pagination: {
				nextCursor,
				hasNextPage: !!nextCursor
			}
		};
	}
}
