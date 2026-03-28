import { makeDistrictRepository } from "@/factories/repositories/make-district-repository.js";
import { ListDistrictService } from "@/services/district/list-district-service.js";

export const makeListDistrictService = () => {
	const districtRepository = makeDistrictRepository();
	return new ListDistrictService(districtRepository);
};
