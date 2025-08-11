// fastify-jwt.d.ts
import "@fastify/jwt";
import type { RoleType } from "@prisma/client";

declare module "@fastify/jwt" {
	export interface FastifyJWT {
		user: {
			sub: string;
			role: RoleType;
		};
	}
}
