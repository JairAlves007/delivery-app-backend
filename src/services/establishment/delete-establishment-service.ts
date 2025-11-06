import { forgetAllListingCacheKeysEvent } from "@/events/forget-listing-cache-keys-event.ts";
import type { IEstablishmentRepository } from "@/interfaces/repositories/establishment-repository.ts";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.ts";

type DeleteEstablishmentParams = {
	id: string;
} & Pick<ForgetAllListingCacheKeysParams, "paramsToForget">;

export class DeleteEstablishmentService {
	private establishmentRepository: IEstablishmentRepository;

	constructor(establishmentRepository: IEstablishmentRepository) {
		this.establishmentRepository = establishmentRepository;
	}

	public async handle({ id, paramsToForget }: DeleteEstablishmentParams) {
		await this.establishmentRepository.delete({ id, force: false });

		forgetAllListingCacheKeysEvent.emit("forget-all-listing-cache-keys", {
			baseCacheKey: "establishments",
			paramsToForget
		});
	}
}
