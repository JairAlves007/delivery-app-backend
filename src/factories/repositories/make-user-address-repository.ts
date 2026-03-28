import { UserAddressPrismaRepository } from "@/repositories/user-address-prisma-repository.js";

export const makeUserAddressRepository = () => {
	return new UserAddressPrismaRepository();
};
