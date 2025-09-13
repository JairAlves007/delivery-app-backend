import type { Prisma, RoleType } from "@prisma/client";

export type Profile = Prisma.UserGetPayload<{
	select: {
		name: true;
		email: true;
	};
}> & {
	role: RoleType;
};

export type UserWithRole = Prisma.UserGetPayload<{
	include: { role: true; establishment: true };
}>;
