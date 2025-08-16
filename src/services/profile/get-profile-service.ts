import { env } from "@/env.ts";
import { UserNotFound } from "@/errors/user/user-not-found.ts";
import type { IUserRepository } from "@/interfaces/repositories/user-repository.ts";
import type { Profile } from "@/interfaces/user.ts";

interface GetProfileServiceRequest {
	id: string;
}

interface GetProfileServiceResponse {
	profile: Profile | null;
	bucketUrl: string;
}

export class GetProfileService {
	private userRepository: IUserRepository;

	constructor(userRepository: IUserRepository) {
		this.userRepository = userRepository;
	}

	async handle({
		id
	}: GetProfileServiceRequest): Promise<GetProfileServiceResponse> {
		try {
			const user = await this.userRepository.findById(id);

			if (!user) throw new UserNotFound();

			const profile: Profile = {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role.name
			};

			return {
				profile,
				bucketUrl: env.PUBLIC_BUCKET_URL
			};
		} catch (error) {
			throw error;
		}
	}
}
