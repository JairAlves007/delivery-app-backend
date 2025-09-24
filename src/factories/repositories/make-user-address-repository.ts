import { UserAddressPrismaRepository } from "@/repositories/user-address-prisma-repository.ts";

export const makeUserAddressRepository = () => {
	return new UserAddressPrismaRepository();
};
