import { Role, User } from "@prisma/client";

export interface UserRepository {
	findByEmail(email: string): Promise<(User & { role: Role }) | null>;
}
