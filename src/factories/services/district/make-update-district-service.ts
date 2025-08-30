import { makeDistrictRepository } from "@/factories/repositories/make-district-repository.ts";
import { UpdateDistrictService } from "@/services/district/update-district-service.ts";

export const makeUpdateDistrictService = () => {
	const districtRepository = makeDistrictRepository();
	return new UpdateDistrictService(districtRepository);
};
