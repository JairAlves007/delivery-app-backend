import { InvalidPage } from "@/errors/pagination/invalid-page.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import type { IEstablishmentRepository } from "@/interfaces/repositories/establishment-repository.ts";
import { listQueryParamsSchema } from "@/schemas/generic-schema.ts";
import type { Establishment } from "@prisma/client";
import z from "zod";

type ListEstablishmentServiceRequest = z.infer<typeof listQueryParamsSchema>;

interface ListEstablishmentServiceResponse
	extends Pick<ListEstablishmentServiceRequest, "page"> {
	establishments: Establishment[];
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
		perPage,
		establishmentId
	}: ListEstablishmentServiceRequest): Promise<ListEstablishmentServiceResponse> {
		const cache = makeCache();
		const prefixKey = !!establishmentId ? `${establishmentId}_` : "";

		const isPaging = !!page;
		const totalPromise = cache.rememberForever(
			`${prefixKey}total_${cache.keys.establishments}`,
			async () => await this.establishmentRepository.count(establishmentId)
		);

		if (isPaging) {
			const [total, establishments] = await Promise.all([
				totalPromise,
				cache.rememberForever(
					`${prefixKey}${cache.keys.establishments}_page_${page}_per_page_${perPage}`,
					async () =>
						await this.establishmentRepository.paginate(
							page,
							perPage,
							establishmentId
						)
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
				`${prefixKey}all_${cache.keys.establishments}`,
				async () => await this.establishmentRepository.listAll(establishmentId)
			)
		]);

		return {
			establishments,
			page,
			total
		};
	}
}
