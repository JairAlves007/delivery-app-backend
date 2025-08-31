import { InvalidPage } from "@/errors/pagination/invalid-page.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import { transformPriceFromDatabase } from "@/helpers/price.ts";
import type { IDistrictRepository } from "@/interfaces/repositories/district-repository.ts";
import { paginationQueryParamsSchema } from "@/schemas/generic-schema.ts";
import type { District } from "@prisma/client";
import z from "zod";

type ListDistrictServiceRequest = z.infer<typeof paginationQueryParamsSchema>;

interface ListDistrictServiceResponse
	extends Pick<ListDistrictServiceRequest, "page"> {
	districts: District[];
	total: number;
	perPage?: number;
	totalPages?: number;
}

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
		perPage
	}: ListDistrictServiceRequest): Promise<ListDistrictServiceResponse> {
		const cache = makeCache();

		const isPaging = !!page;
		const totalPromise = cache.rememberForever(
			"total_districts",
			async () => await this.districtRepository.count()
		);

		if (isPaging) {
			const [total, districts] = await Promise.all([
				totalPromise,
				cache.rememberForever(
					`districts_page_${page}_per_page_${perPage}`,
					async () => await this.districtRepository.paginate(page, perPage)
				)
			]);

			const totalPages = Math.ceil(total / perPage);

			if (page > totalPages) throw new InvalidPage();

			return {
				districts: this.mapDistricts(districts),
				page,
				perPage,
				total,
				totalPages
			};
		}

		const [total, districts] = await Promise.all([
			totalPromise,
			cache.rememberForever(
				"all_districts",
				async () => await this.districtRepository.listAll()
			)
		]);

		return {
			districts: this.mapDistricts(districts),
			page,
			total
		};
	}
}
