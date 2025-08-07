import { verifyToken } from "@/lib/jwt";
import Constants from "./constants";

export function slugify(text: string): string {
	return text
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.replace(/--+/g, "-");
}

export function getAuthUser(authorization: string) {
	const token = authorization?.replace(`${Constants.TOKEN_TYPE} `, "");

	return token ? verifyToken(token) : null;
}
