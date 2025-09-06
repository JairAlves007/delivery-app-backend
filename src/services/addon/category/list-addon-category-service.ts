import { InvalidPage } from "@/errors/pagination/invalid-page.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import type { IAddonCategoryRepository } from "@/interfaces/repositories/addon-category-repository.ts";
import { paginationQueryParamsSchema } from "@/schemas/generic-schema.ts";
import type { AddonCategory } from "@prisma/client";
import z from "zod";

type ListAddonCategoryServiceRequest = z.infer<
	typeof paginationQueryParamsSchema
>;

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
		perPage
	}: ListAddonCategoryServiceRequest): Promise<ListAddonCategoryServiceResponse> {
		const cache = makeCache();

		const isPaging = !!page;
		const totalPromise = cache.rememberForever(
			`total_${cache.keys.addonCategories}`,
			async () => await this.addonCategoryRepository.count()
		);

		if (isPaging) {
			const [total, addonCategories] = await Promise.all([
				totalPromise,
				cache.rememberForever(
					`${cache.keys.addonCategories}_page_${page}_per_page_${perPage}`,
					async () => await this.addonCategoryRepository.paginate(page, perPage)
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
				`all_${cache.keys.addonCategories}`,
				async () => await this.addonCategoryRepository.listAll()
			)
		]);

		return {
			addonCategories,
			page,
			total
		};
	}
}
