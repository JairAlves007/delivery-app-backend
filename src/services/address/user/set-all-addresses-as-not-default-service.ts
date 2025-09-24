import { IUserAddressRepository } from "@/interfaces/repositories/user-address-repository.ts";
import { UserID } from "@/types/user.ts";

export class SetAllAddressesAsNotDefaultService {
	private userAddressRepository: IUserAddressRepository;

	constructor(userAddressRepository: IUserAddressRepository) {
		this.userAddressRepository = userAddressRepository;
	}

	async handle(userID: UserID) {
		await this.userAddressRepository.setAllAsNotDefault(userID);
	}
}
