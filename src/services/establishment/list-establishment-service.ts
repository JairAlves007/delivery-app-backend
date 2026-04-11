import z from "zod";

import { InvalidPage } from "@/errors/pagination/invalid-page.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import { mapObjectResourcesList } from "@/helpers/resource.js";
import type { IEstablishmentRepository } from "@/interfaces/repositories/establishment-repository.js";
import { listQueryParamsSchema } from "@/schemas/generic-schema.js";
import type { PaginatedResponse } from "@/types/crud.js";
import type {
	EstablishmentFromRepository,
	EstablishmentsList
} from "@/types/establishment.js";

type ListEstablishmentServiceRequest = z.infer<typeof listQueryParamsSchema>;

type ListEstablishmentServiceResponse = PaginatedResponse<EstablishmentsList>;

export class ListEstablishmentService {
	private establishmentRepository: IEstablishmentRepository;

	constructor(establishmentRepository: IEstablishmentRepository) {
		this.establishmentRepository = establishmentRepository;
	}

	private mapEstablishments(
		establishments: EstablishmentFromRepository[]
	): EstablishmentsList[] {
		return establishments.map(establishment => {
			return {
				...establishment,
				address: establishment.address?.address ?? null,
				resources: mapObjectResourcesList(establishment.resources)
			};
		});
	}

	async handle({
		page,
		perPage,
		...filterParams
	}: ListEstablishmentServiceRequest): Promise<ListEstablishmentServiceResponse> {
		const cache = makeCache();
		const prefixKey = getFilterParamsCacheKey(filterParams);

		const isPaging = !!page;
		const totalPromise = cache.rememberForever(
			`${prefixKey}total_${cache.keys.establishments}`,
			async () => await this.establishmentRepository.count({ ...filterParams })
		);

		if (isPaging) {
			const key = `${prefixKey}${cache.keys.establishments}_page_${page}_per_page_${perPage}`;
			const [total, establishments] = await Promise.all([
				totalPromise,
				cache.rememberForever(
					key,
					async () =>
						await this.establishmentRepository.paginate({
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
				items: this.mapEstablishments(establishments),
				pagination: {
					page,
					perPage,
					total,
					totalPages
				}
			};
		}

		const [total, establishments] = await Promise.all([
			totalPromise,
			cache.rememberForever(
				`${prefixKey}all_${cache.keys.establishments}`,
				async () =>
					await this.establishmentRepository.listAll({ ...filterParams })
			)
		]);

		return {
			items: this.mapEstablishments(establishments),
			pagination: {
				page: 1,
				perPage: total,
				total,
				totalPages: 1
			}
		};
	}
}
