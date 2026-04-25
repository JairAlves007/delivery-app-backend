import { makeCache } from "@/factories/services/cache/make-cache.js";
import type { IUserRepository } from "@/interfaces/repositories/user-repository.js";
import type { UserID, UserWithRole } from "@/types/user.js";

export class FindUserService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async handle(id: UserID): Promise<UserWithRole | null> {
    const cache = makeCache();
    const key = `${cache.keys.users}_${id}`;

    return await cache.rememberForever(
      key,
      async () => await this.userRepository.findById(id),
    );
  }
}
