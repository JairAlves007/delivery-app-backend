import { makeDistrictRepository } from "@/factories/repositories/make-district-repository.ts";
import { DeleteDistrictService } from "@/services/district/delete-district-service.ts";

export const makeDeleteDistrictService = () => {
	const districtRepository = makeDistrictRepository();
	return new DeleteDistrictService(districtRepository);
};
