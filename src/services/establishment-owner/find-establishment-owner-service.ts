import { UserNotFound } from "@/errors/user/user-not-found.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import { RoleType } from "@/generated/prisma/client.js";
import type { IUserRepository } from "@/interfaces/repositories/user-repository.js";
import type { UserWithRole } from "@/types/user.js";

export class FindEstablishmentOwnerService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async handle(id: string): Promise<UserWithRole> {
    const cache = makeCache();
    const key = `${cache.keys.users}_owner_${id}`;

    const owner = await cache.rememberForever(
      key,
      async () => await this.userRepository.findById(id),
    );

    if (!owner || owner.role.name !== RoleType.ESTABLISHMENT_OWNER) {
      throw new UserNotFound();
    }

    return owner;
  }
}
