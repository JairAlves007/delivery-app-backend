import z from "zod";

import { InvalidPage } from "@/errors/pagination/invalid-page.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import type { Addon } from "@/generated/prisma/client.js";
import Constants from "@/helpers/constants.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import { transformPriceFromDatabase } from "@/helpers/price.js";
import type { IAddonRepository } from "@/interfaces/repositories/addon-repository.js";
import { listQueryParamsSchema } from "@/schemas/generic-schema.js";
import type { FilterField } from "@/types/crud.js";

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
		const totalPromise = cache.remember(
			`${prefixKey}total_${cache.keys.addons}`,
			Constants.CACHE_TTL.addons,
			async () => await this.addonRepository.count(filterParams)
		);

		if (isPaging) {
			const key = `${prefixKey}${cache.keys.addons}_page_${page}_per_page_${perPage}`;
			const [total, addons] = await Promise.all([
				totalPromise,
				cache.remember(
					key,
					Constants.CACHE_TTL.addons,
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
			cache.remember(
				`${prefixKey}all_${cache.keys.addons}`,
				Constants.CACHE_TTL.addons,
				async () => await this.addonRepository.listAll(filterParams)
			)
		]);

		return {
			addons: this.mapAddons(addons),
			total
		};
	}
}
