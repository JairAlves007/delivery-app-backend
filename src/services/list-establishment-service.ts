import { InvalidPage } from "@/errors/establishment/invalid-page";
import { makeCache } from "@/factories/make-cache";
import { IEstablishmentRepository } from "@/interfaces/repositories/establishment-repository";
import { listEstablishmentQueryParamsSchema } from "@/schemas/establishment-schema";
import { Establishment } from "@prisma/client";
import z from "zod";

type ListEstablishmentServiceRequest = z.infer<
	typeof listEstablishmentQueryParamsSchema
>;

interface ListEstablishmentServiceResponse
	extends Pick<ListEstablishmentServiceRequest, "page"> {
	establishments: Establishment[];
	total: number;
	perPage?: number;
	totalPages?: number;
}

export class ListEstablishmentService {
	constructor(private establishmentRepository: IEstablishmentRepository) {}

	async handle({
		page,
		perPage
	}: ListEstablishmentServiceRequest): Promise<ListEstablishmentServiceResponse> {
		const cache = makeCache();

		const isPaging = !!page;
		const totalPromise = cache.rememberForever(
			"total_establishments",
			async () => await this.establishmentRepository.count()
		);

		if (isPaging) {
			const [total, establishments] = await Promise.all([
				totalPromise,
				cache.rememberForever(
					`establishments_page_${page}`,
					async () => await this.establishmentRepository.paginate(page, perPage)
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
				"all_establishments",
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
