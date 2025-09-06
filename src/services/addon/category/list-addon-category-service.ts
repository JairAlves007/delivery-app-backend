import { InvalidPage } from "@/errors/pagination/invalid-page.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import type { IAddonCategoryRepository } from "@/interfaces/repositories/addon-category-repository.ts";
import { listQueryParamsSchema } from "@/schemas/generic-schema.ts";
import type { AddonCategory } from "@prisma/client";
import z from "zod";

type ListAddonCategoryServiceRequest = z.infer<typeof listQueryParamsSchema>;

interface ListAddonCategoryServiceResponse
	extends Pick<ListAddonCategoryServiceRequest, "page"> {
	addonCategories: AddonCategory[];
	total: number;
	perPage?: number;
	totalPages?: number;
}

export class ListAddonCategoryService {
	private addonCategoryRepository: IAddonCategoryRepository;

	constructor(addonCategoryRepository: IAddonCategoryRepository) {
		this.addonCategoryRepository = addonCategoryRepository;
	}

	async handle({
		page,
		perPage,
		establishmentId
	}: ListAddonCategoryServiceRequest): Promise<ListAddonCategoryServiceResponse> {
		const cache = makeCache();
		const prefixKey = !!establishmentId ? `${establishmentId}_` : "";

		const isPaging = !!page;
		const totalPromise = cache.rememberForever(
			`${prefixKey}total_${cache.keys.addonCategories}`,
			async () => await this.addonCategoryRepository.count(establishmentId)
		);

		if (isPaging) {
			const [total, addonCategories] = await Promise.all([
				totalPromise,
				cache.rememberForever(
					`${prefixKey}${cache.keys.addonCategories}_page_${page}_per_page_${perPage}`,
					async () =>
						await this.addonCategoryRepository.paginate(
							page,
							perPage,
							establishmentId
						)
				)
			]);

			const totalPages = Math.ceil(total / perPage);

			if (page > totalPages) throw new InvalidPage();

			return {
				addonCategories,
				page,
				perPage,
				total,
				totalPages
			};
		}

		const [total, addonCategories] = await Promise.all([
			totalPromise,
			cache.rememberForever(
				`${prefixKey}all_${cache.keys.addonCategories}`,
				async () => await this.addonCategoryRepository.listAll(establishmentId)
			)
		]);

		return {
			addonCategories,
			page,
			total
		};
	}
}
