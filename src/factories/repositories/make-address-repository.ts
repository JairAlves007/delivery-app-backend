import { AddressPrismaRepository } from "@/repositories/address-prisma-repository.ts";

export const makeAddressRepository = () => {
	return new AddressPrismaRepository();
};
