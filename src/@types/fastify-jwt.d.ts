// fastify-jwt.d.ts
import "@fastify/jwt";
import type { EstablishmentID } from "@/types/establishment.ts";
import type { RoleType } from "@prisma/client";

declare module "@fastify/jwt" {
	export interface FastifyJWT {
		user: {
			sub: string;
			establishmentId?: EstablishmentID | null;
			role: RoleType;
		};
	}
}
