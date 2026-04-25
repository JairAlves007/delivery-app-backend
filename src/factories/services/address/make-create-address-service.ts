import { makeAddressRepository } from "@/factories/repositories/make-address-repository.js";
import { CreateAddressService } from "@/services/address/create-address-service.js";

export const makeCreateAddressService = () => {
  const addressRepository = makeAddressRepository();
  return new CreateAddressService(addressRepository);
};
