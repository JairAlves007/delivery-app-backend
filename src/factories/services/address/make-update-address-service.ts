import { makeAddressRepository } from "@/factories/repositories/make-address-repository.js";
import { UpdateAddressService } from "@/services/address/update-address-service.js";

export const makeUpdateAddressService = () => {
	const addressRepository = makeAddressRepository();
	return new UpdateAddressService(addressRepository);
};
