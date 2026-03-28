import { AddressPrismaRepository } from "@/repositories/address-prisma-repository.js";

export const makeAddressRepository = () => {
	return new AddressPrismaRepository();
};
