import { InvalidPage } from "@/errors/pagination/invalid-page.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import { transformPriceFromDatabase } from "@/helpers/price.ts";
import type { IAddonRepository } from "@/interfaces/repositories/addon-repository.ts";
import { listQueryParamsSchema } from "@/schemas/generic-schema.ts";
import type { Addon } from "@prisma/client";
import z from "zod";

type ListAddonServiceRequest = z.infer<typeof listQueryParamsSchema>;

interface ListAddonServiceResponse
	extends Pick<ListAddonServiceRequest, "page"> {
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
		establishmentId
	}: ListAddonServiceRequest): Promise<ListAddonServiceResponse> {
		const cache = makeCache();
		const prefixKey = !!establishmentId ? `${establishmentId}_` : "";

		const isPaging = !!page;
		const totalPromise = cache.rememberForever(
			`${prefixKey}total_${cache.keys.addons}`,
			async () =>
				await this.addonRepository.count({ establishment_id: establishmentId })
		);

		if (isPaging) {
			const [total, addons] = await Promise.all([
				totalPromise,
				cache.rememberForever(
					`${prefixKey}${cache.keys.addons}_page_${page}_per_page_${perPage}`,
					async () =>
						await this.addonRepository.paginate({
							page,
							limit: perPage,
							filterParams: { establishment_id: establishmentId }
						})
				)
			]);

			const totalPages = Math.ceil(total / perPage);

			if (page > totalPages) throw new InvalidPage();

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
				async () =>
					await this.addonRepository.listAll({
						establishment_id: establishmentId
					})
			)
		]);

		return {
			addons: this.mapAddons(addons),
			page,
			total
		};
	}
}
