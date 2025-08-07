// types/fastify.d.ts
import { UserWithRoleType } from "@/interfaces/user-with-role-type";
import { RoleType } from "@prisma/client";
import "fastify";

declare module "fastify" {
	interface FastifyRequest {
		role: RoleType | null;
		user: UserWithRoleType | null;
	}
}
