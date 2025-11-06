import { UserNotFound } from "@/errors/user/user-not-found.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import { getFilterParamsCacheKey } from "@/helpers/crud.ts";
import type { IUserRepository } from "@/interfaces/repositories/user-repository.ts";
import type { Profile } from "@/types/user.ts";

interface GetProfileServiceRequest {
	id: string;
}

export class GetProfileService {
	private userRepository: IUserRepository;

	constructor(userRepository: IUserRepository) {
		this.userRepository = userRepository;
	}

	async handle({ id }: GetProfileServiceRequest): Promise<Profile | null> {
		try {
			const cache = makeCache();
			const prefixKey = getFilterParamsCacheKey({
				user_id: id
			});
			const key = `${prefixKey}${cache.keys.profile}`;

			const user = await cache.rememberForever(
				key,
				async () => await this.userRepository.findById(id)
			);

			if (!user) throw new UserNotFound();

			return {
				name: user.name,
				email: user.email,
				role: user.role.name
			};
		} catch (error) {
			throw error;
		}
	}
}
