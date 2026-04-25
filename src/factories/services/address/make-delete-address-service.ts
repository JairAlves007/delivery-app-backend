import { makeAddressRepository } from "@/factories/repositories/make-address-repository.js";
import { DeleteAddressService } from "@/services/address/delete-address-service.js";

export const makeDeleteAddressService = () => {
  const addressRepository = makeAddressRepository();
  return new DeleteAddressService(addressRepository);
};
