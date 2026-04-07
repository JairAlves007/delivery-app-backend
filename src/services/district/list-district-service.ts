import z from "zod";

import { InvalidPage } from "@/errors/pagination/invalid-page.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import type { District } from "@/generated/prisma/client.js";
import Constants from "@/helpers/constants.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import { transformPriceFromDatabase } from "@/helpers/price.js";
import type { IDistrictRepository } from "@/interfaces/repositories/district-repository.js";
import { listQueryParamsSchema } from "@/schemas/generic-schema.js";
import type { FilterField, PaginatedResponse } from "@/types/crud.js";

type ListDistrictServiceRequest = z.infer<typeof listQueryParamsSchema> &
	FilterField;

type ListDistrictServiceResponse = PaginatedResponse<District>;

export class ListDistrictService {
	private districtRepository: IDistrictRepository;

	constructor(districtRepository: IDistrictRepository) {
		this.districtRepository = districtRepository;
	}

	private mapDistricts(districts: District[]) {
		return districts.map(district => ({
			...district,
			shipping_cost: transformPriceFromDatabase(district.shipping_cost)
		}));
	}

	async handle({
		page,
		perPage,
		filterParams
	}: ListDistrictServiceRequest): Promise<ListDistrictServiceResponse> {
		const cache = makeCache();
		const prefixKey = getFilterParamsCacheKey(filterParams);

		const isPaging = !!page;
		const totalPromise = cache.remember(
			`${prefixKey}total_${cache.keys.districts}`,
			Constants.CACHE_TTL.districts,
			async () => await this.districtRepository.count(filterParams)
		);

		if (isPaging) {
			const key = `${prefixKey}${cache.keys.districts}_page_${page}_per_page_${perPage}`;

			const [total, districts] = await Promise.all([
				totalPromise,
				cache.remember(
					key,
					Constants.CACHE_TTL.districts,
					async () =>
						await this.districtRepository.paginate({
							page,
							perPage,
							filterParams
						})
				)
			]);

			const totalPages = Math.ceil(total / perPage);

			if (page > totalPages && totalPages > 0) {
				await cache.forget(key);
				throw new InvalidPage();
			}

			return {
				items: this.mapDistricts(districts),
				pagination: {
					page,
					perPage,
					total,
					totalPages
				}
			};
		}

		const [total, districts] = await Promise.all([
			totalPromise,
			cache.remember(
				`${prefixKey}all_${cache.keys.districts}`,
				Constants.CACHE_TTL.districts,
				async () => await this.districtRepository.listAll(filterParams)
			)
		]);

		return {
			items: this.mapDistricts(districts),
			pagination: {
				page: 1,
				perPage: total,
				total,
				totalPages: 1
			}
		};
	}
}
