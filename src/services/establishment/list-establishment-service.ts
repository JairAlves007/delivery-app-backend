import { InvalidPage } from "@/errors/pagination/invalid-page.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import type { IEstablishmentRepository } from "@/interfaces/repositories/establishment-repository.ts";
import { listQueryParamsSchema } from "@/schemas/generic-schema.ts";
import type { EstablishmentWithInfo } from "@/types/establishment.ts";
import z from "zod";

type ListEstablishmentServiceRequest = z.infer<typeof listQueryParamsSchema>;

interface ListEstablishmentServiceResponse
	extends Pick<ListEstablishmentServiceRequest, "page"> {
	establishments: EstablishmentWithInfo[];
	total: number;
	perPage?: number;
	totalPages?: number;
}

export class ListEstablishmentService {
	private establishmentRepository: IEstablishmentRepository;

	constructor(establishmentRepository: IEstablishmentRepository) {
		this.establishmentRepository = establishmentRepository;
	}

	async handle({
		page,
		perPage
	}: ListEstablishmentServiceRequest): Promise<ListEstablishmentServiceResponse> {
		const cache = makeCache();

		const isPaging = !!page;
		const totalPromise = cache.rememberForever(
			`total_${cache.keys.establishments}`,
			async () => await this.establishmentRepository.count()
		);

		if (isPaging) {
			const [total, establishments] = await Promise.all([
				totalPromise,
				cache.rememberForever(
					`${cache.keys.establishments}_page_${page}_per_page_${perPage}`,
					async () =>
						await this.establishmentRepository.paginate({ page, perPage })
				)
			]);

			const totalPages = Math.ceil(total / perPage);

			if (page > totalPages) throw new InvalidPage();

			return {
				establishments,
				page,
				perPage,
				total,
				totalPages
			};
		}

		const [total, establishments] = await Promise.all([
			totalPromise,
			cache.rememberForever(
				`all_${cache.keys.establishments}`,
				async () => await this.establishmentRepository.listAll()
			)
		]);

		return {
			establishments,
			page,
			total
		};
	}
}
