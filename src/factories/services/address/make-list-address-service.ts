import { makeAddressRepository } from "@/factories/repositories/make-address-repository.ts";
import { ListAddressService } from "@/services/address/list-address-service.ts";

export const makeListAddressService = () => {
	const addressRepository = makeAddressRepository();
	return new ListAddressService(addressRepository);
};
