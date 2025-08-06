import { env } from "@/env";
import { Role, User } from "@prisma/client";
import jwt from "jsonwebtoken";

interface UserWithRole extends User {
	role: Role;
}

export const generateToken = (user: UserWithRole): string => {
	const { id, name, email, role } = user;

	return jwt.sign({ id, name, email, role: role.name }, env.JWT_SECRET);
};
