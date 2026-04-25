import type { IUserAddressRepository } from "@/interfaces/repositories/user-address-repository.js";
import prisma from "@/lib/prisma.js";
import type { UserID } from "@/types/user.js";

export class UserAddressPrismaRepository implements IUserAddressRepository {
  async setAllAsNotDefault(userId: UserID): Promise<void> {
    await prisma.userAddress.updateMany({
      where: {
        user_id: userId,
      },
      data: {
        is_default: false,
      },
    });
  }
}
