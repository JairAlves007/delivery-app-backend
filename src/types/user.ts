import z from "zod";

import type { Prisma } from "@/generated/prisma/client.js";
import { userIdSchema } from "@/schemas/generic-schema.js";

export type UserWithRole = Prisma.UserGetPayload<{
	include: { role: true; establishment: true };
}>;

export type UserID = z.infer<typeof userIdSchema>;
