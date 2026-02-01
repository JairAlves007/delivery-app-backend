// types/fastify.d.ts
import { RoleType } from "@/generated/prisma/client.ts";
import "fastify";

declare module "fastify" {
	interface FastifyRequest {
		role: RoleType;
	}
}
