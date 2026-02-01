import { InvalidPage } from "@/errors/pagination/invalid-page.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import type { Addon } from "@/generated/prisma/client.ts";
import { getFilterParamsCacheKey } from "@/helpers/crud.ts";
import { transformPriceFromDatabase } from "@/helpers/price.ts";
import type { IAddonRepository } from "@/interfaces/repositories/addon-repository.ts";
import { listQueryParamsSchema } from "@/schemas/generic-schema.ts";
import type { FilterField } from "@/types/crud.ts";
import z from "zod";

type ListAddonServiceRequest = z.infer<typeof listQueryParamsSchema> &
	FilterField;

interface ListAddonServiceResponse extends Pick<
	ListAddonServiceRequest,
	"page"
> {
	addons: Addon[];
	total: number;
	perPage?: number;
	totalPages?: number;
}

export class ListAddonService {
	private addonRepository: IAddonRepository;

	constructor(addonRepository: IAddonRepository) {
		this.addonRepository = addonRepository;
	}

	private mapAddons(addons: Addon[]) {
		return addons.map(addon => ({
			...addon,
			price: transformPriceFromDatabase(addon.price)
		}));
	}

	async handle({
		page,
		perPage,
		filterParams
	}: ListAddonServiceRequest): Promise<ListAddonServiceResponse> {
		const cache = makeCache();
		const prefixKey = getFilterParamsCacheKey(filterParams);

		const isPaging = !!page;
		const totalPromise = cache.rememberForever(
			`${prefixKey}total_${cache.keys.addons}`,
			async () => await this.addonRepository.count(filterParams)
		);

		if (isPaging) {
			const key = `${prefixKey}${cache.keys.addons}_page_${page}_per_page_${perPage}`;
			const [total, addons] = await Promise.all([
				totalPromise,
				cache.rememberForever(
					key,
					async () =>
						await this.addonRepository.paginate({
							page,
							perPage,
							filterParams
						})
				)
			]);

			const totalPages = Math.ceil(total / perPage);

			if (page > totalPages) {
				await cache.forget(key);
				throw new InvalidPage();
			}

			return {
				addons: this.mapAddons(addons),
				page,
				perPage,
				total,
				totalPages
			};
		}

		const [total, addons] = await Promise.all([
			totalPromise,
			cache.rememberForever(
				`${prefixKey}all_${cache.keys.addons}`,
				async () => await this.addonRepository.listAll(filterParams)
			)
		]);

		return {
			addons: this.mapAddons(addons),
			total
		};
	}
}
