import type { IUserAddressRepository } from "@/interfaces/repositories/user-address-repository.js";
import type { UserID } from "@/types/user.js";

export class SetAllAddressesAsNotDefaultService {
  private userAddressRepository: IUserAddressRepository;

  constructor(userAddressRepository: IUserAddressRepository) {
    this.userAddressRepository = userAddressRepository;
  }

  async handle(userID: UserID) {
    await this.userAddressRepository.setAllAsNotDefault(userID);
  }
}
