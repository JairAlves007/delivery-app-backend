// fastify-jwt.d.ts
import type { RoleType } from "@/generated/prisma/client.ts";
import type { EstablishmentID } from "@/types/establishment.ts";
import "@fastify/jwt";

declare module "@fastify/jwt" {
	export interface FastifyJWT {
		user: {
			sub: string;
			activeTenantId: EstablishmentID;
			primaryTenantId?: EstablishmentID | null;
			role: RoleType;
		};
	}
}
