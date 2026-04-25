import type { UserID } from "@/types/user.js";

export interface IUserAddressRepository {
  setAllAsNotDefault(userId: UserID): Promise<void>;
}
