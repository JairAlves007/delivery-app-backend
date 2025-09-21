import { makeAddressRepository } from "@/factories/repositories/make-address-repository.ts";
import { UpdateAddressService } from "@/services/address/update-address-service.ts";

export const makeUpdateAddressService = () => {
	const addressRepository = makeAddressRepository();
	return new UpdateAddressService(addressRepository);
};
