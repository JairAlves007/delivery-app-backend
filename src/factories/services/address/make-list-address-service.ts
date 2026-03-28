import { makeAddressRepository } from "@/factories/repositories/make-address-repository.js";
import { ListAddressService } from "@/services/address/list-address-service.js";

export const makeListAddressService = () => {
	const addressRepository = makeAddressRepository();
	return new ListAddressService(addressRepository);
};
