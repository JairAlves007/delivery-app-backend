import { makeDistrictRepository } from "@/factories/repositories/make-district-repository.js";
import { DeleteDistrictService } from "@/services/district/delete-district-service.js";

export const makeDeleteDistrictService = () => {
	const districtRepository = makeDistrictRepository();
	return new DeleteDistrictService(districtRepository);
};
