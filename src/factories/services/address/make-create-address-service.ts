import { makeAddressRepository } from "@/factories/repositories/make-address-repository.ts";
import { CreateAddressService } from "@/services/address/create-address-service.ts";

export const makeCreateAddressService = () => {
	const addressRepository = makeAddressRepository();
	return new CreateAddressService(addressRepository);
};
