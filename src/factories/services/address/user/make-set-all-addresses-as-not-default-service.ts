import { makeUserAddressRepository } from "@/factories/repositories/make-user-address-repository.ts";
import { SetAllAddressesAsNotDefaultService } from "@/services/address/user/set-all-addresses-as-not-default-service.ts";

export const makeSetAllAddressesAsNotDefaultService = () => {
	const userAddressRepository = makeUserAddressRepository();
	return new SetAllAddressesAsNotDefaultService(userAddressRepository);
};
