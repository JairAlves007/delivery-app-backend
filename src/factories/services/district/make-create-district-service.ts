import { makeDistrictRepository } from "@/factories/repositories/make-district-repository.js";
import { CreateDistrictService } from "@/services/district/create-district-service.js";

export const makeCreateDistrictService = () => {
	const districtRepository = makeDistrictRepository();
	return new CreateDistrictService(districtRepository);
};
