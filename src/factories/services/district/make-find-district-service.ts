import { makeDistrictRepository } from "@/factories/repositories/make-district-repository.js";
import { FindDistrictService } from "@/services/district/find-district-service.js";

export const makeFindDistrictService = () => {
  const districtRepository = makeDistrictRepository();
  return new FindDistrictService(districtRepository);
};
