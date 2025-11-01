// fastify-jwt.d.ts
import type { EstablishmentID } from "@/types/establishment.ts";
import "@fastify/jwt";
import type { RoleType } from "@prisma/client";

declare module "@fastify/jwt" {
	export interface FastifyJWT {
		user: {
			sub: string;
			myEstablishmentId?: EstablishmentID | null;
			role: RoleType;
		};
	}
}
