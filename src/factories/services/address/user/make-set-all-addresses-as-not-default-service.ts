import { makeUserAddressRepository } from "@/factories/repositories/make-user-address-repository.js";
import { SetAllAddressesAsNotDefaultService } from "@/services/address/user/set-all-addresses-as-not-default-service.js";

export const makeSetAllAddressesAsNotDefaultService = () => {
	const userAddressRepository = makeUserAddressRepository();
	return new SetAllAddressesAsNotDefaultService(userAddressRepository);
};
