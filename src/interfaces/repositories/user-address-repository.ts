import { UserID } from "@/types/user.ts";

export interface IUserAddressRepository {
	setAllAsNotDefault(userId: UserID): Promise<void>;
}
