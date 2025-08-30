import { makeDistrictRepository } from "@/factories/repositories/make-district-repository.ts";
import { CreateDistrictService } from "@/services/district/create-district-service.ts";

export const makeCreateDistrictService = () => {
	const districtRepository = makeDistrictRepository();
	return new CreateDistrictService(districtRepository);
};
