import { env } from "@/env";
import { UserUnauthenticated } from "@/errors/user/user-unauthenticated";
import { UserWithRoleType } from "@/interfaces/user";
import jwt from "jsonwebtoken";

export const generateToken = (user: UserWithRoleType): string => {
	const { id, name, email, roleType } = user;

	return jwt.sign({ id, name, email, roleType }, env.JWT_SECRET);
};

export const verifyToken = (token: string): UserWithRoleType | null => {
	try {
		return jwt.verify(token, env.JWT_SECRET) as UserWithRoleType;
	} catch (error) {
		throw new UserUnauthenticated();
	}
};
