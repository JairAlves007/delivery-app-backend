import type { Address, Prisma } from "@/generated/prisma/client.ts";

export type UserAddressStructured = Prisma.UserAddressGetPayload<{
	select: {
		id: true;
		is_default: true;
		address: {
			select: {
				id: true;
				city: true;
				complement: true;
				district: true;
				number: true;
				neighborhood: true;
				state: true;
				street: true;
				postal_code: true;
				phone: true;
				reference_point: true;
				latitude: true;
				longitude: true;
			};
		};
	};
}>;

export type UserAddressWithDefault = Address & {
	address_id: string;
	is_default: boolean;
};
