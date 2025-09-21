import { makeAddressRepository } from "@/factories/repositories/make-address-repository.ts";
import { DeleteAddressService } from "@/services/address/delete-address-service.ts";

export const makeDeleteAddressService = () => {
	const addressRepository = makeAddressRepository();
	return new DeleteAddressService(addressRepository);
};
