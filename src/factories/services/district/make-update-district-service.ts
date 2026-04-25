import { makeDistrictRepository } from "@/factories/repositories/make-district-repository.js";
import { UpdateDistrictService } from "@/services/district/update-district-service.js";

export const makeUpdateDistrictService = () => {
  const districtRepository = makeDistrictRepository();
  return new UpdateDistrictService(districtRepository);
};
