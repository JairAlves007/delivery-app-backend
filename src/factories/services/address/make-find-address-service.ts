import { makeAddressRepository } from "@/factories/repositories/make-address-repository.ts";
import { FindAddressService } from "@/services/address/find-address-service.ts";

export const makeFindAddressService = () => {
	const addressRepository = makeAddressRepository();
	return new FindAddressService(addressRepository);
};
