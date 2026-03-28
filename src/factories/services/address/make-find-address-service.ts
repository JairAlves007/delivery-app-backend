import { makeAddressRepository } from "@/factories/repositories/make-address-repository.js";
import { FindAddressService } from "@/services/address/find-address-service.js";

export const makeFindAddressService = () => {
	const addressRepository = makeAddressRepository();
	return new FindAddressService(addressRepository);
};
