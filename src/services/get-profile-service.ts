import { UserNotFound } from "@/errors/user/user-not-found";
import { IUserRepository } from "@/interfaces/repositories/user-repository";
import { Profile, UserWithRole } from "@/interfaces/user";

interface GetProfileServiceRequest {
	id: string;
}

interface GetProfileServiceResponse {
	profile: Profile | null;
}

export class GetProfileService {
	constructor(private userRepository: IUserRepository) {}

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
				profile
			};
		} catch (error) {
			throw error;
		}
	}
}
