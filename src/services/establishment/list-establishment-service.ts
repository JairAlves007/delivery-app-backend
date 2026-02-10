import { InvalidPage } from "@/errors/pagination/invalid-page.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import { getFilterParamsCacheKey } from "@/helpers/crud.ts";
import { mapObjectResourcesList } from "@/helpers/resource.ts";
import type { IEstablishmentRepository } from "@/interfaces/repositories/establishment-repository.ts";
import { listQueryParamsSchema } from "@/schemas/generic-schema.ts";
import type {
	EstablishmentFromRepository,
	EstablishmentsList
} from "@/types/establishment.ts";
import z from "zod";

type ListEstablishmentServiceRequest = z.infer<typeof listQueryParamsSchema>;

interface ListEstablishmentServiceResponse extends Pick<
	ListEstablishmentServiceRequest,
	"page"
> {
	establishments: EstablishmentsList[];
	total: number;
	perPage?: number;
	totalPages?: number;
}

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

			if (page > totalPages) {
				await cache.forget(key);
				throw new InvalidPage();
			}

			return {
				establishments: this.mapEstablishments(establishments),
				page,
				perPage,
				total,
				totalPages
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
			establishments: this.mapEstablishments(establishments),
			total
		};
	}
}
