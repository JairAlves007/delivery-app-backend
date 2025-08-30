import type { IDistrictRepository } from "@/interfaces/repositories/district-repository.ts";
import { updateDistrictBodySchema } from "@/schemas/district-schema.ts";
import z from "zod";

type UpdateDistrictRequest = z.infer<typeof updateDistrictBodySchema>;

export class UpdateDistrictService {
	private districtRepository: IDistrictRepository;

	constructor(districtRepository: IDistrictRepository) {
		this.districtRepository = districtRepository;
	}

	async handle(
		id: number,
		{
			establishmentId,
			shippingCost: shipping_cost,
			...data
		}: UpdateDistrictRequest
	) {
		return await this.districtRepository.update(id, {
			...data,
			shipping_cost,
			establishment: {
				connect: {
					id: establishmentId
				}
			}
		});
	}
}
