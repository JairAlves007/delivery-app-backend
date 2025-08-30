import { makeDistrictRepository } from "@/factories/repositories/make-district-repository.ts";
import { ListDistrictService } from "@/services/district/list-district-service.ts";

export const makeListDistrictService = () => {
	const districtRepository = makeDistrictRepository();
	return new ListDistrictService(districtRepository);
};
