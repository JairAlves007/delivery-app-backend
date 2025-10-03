import { makeDistrictRepository } from "@/factories/repositories/make-district-repository.ts";
import { FindDistrictService } from "@/services/district/find-district-service.ts";

export const makeFindDistrictService = () => {
	const districtRepository = makeDistrictRepository();
	return new FindDistrictService(districtRepository);
};
