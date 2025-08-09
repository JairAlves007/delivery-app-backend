import { InvalidPage } from "@/errors/establishment/invalid-page";
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
		const isPaging = !!page;
		const total = await this.establishmentRepository.count();

		if (isPaging) {
			const totalPages = Math.ceil(total / perPage);
			const establishments = await this.establishmentRepository.paginate(
				page,
				perPage
			);

			if (page > totalPages) throw new InvalidPage();

			return {
				establishments,
				page,
				perPage,
				total,
				totalPages
			};
		}

		const establishments = await this.establishmentRepository.listAll();

		return {
			establishments,
			page,
			total
		};
	}
}
