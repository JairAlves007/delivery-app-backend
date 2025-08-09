import { RoleType } from "@prisma/client";
import z from "zod";

export const requestRoleSchema = z.enum(
	Object.values(RoleType),
	"Papel de administração inválido"
);
