import type { IUserAddressRepository } from "@/interfaces/repositories/user-address-repository.ts";
import { prisma } from "@/lib/prisma.ts";
import type { UserID } from "@/types/user.ts";

export class UserAddressPrismaRepository implements IUserAddressRepository {
	async setAllAsNotDefault(userId: UserID): Promise<void> {
		await prisma.userAddress.updateMany({
			where: {
				user_id: userId
			},
			data: {
				is_default: false
			}
		});
	}
}
