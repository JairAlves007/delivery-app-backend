import { forgetAllListingCacheKeysEvent } from "@/events/forget-listing-cache-keys-event.ts";
import { slugify } from "@/helpers/utils.ts";
import type { IEstablishmentRepository } from "@/interfaces/repositories/establishment-repository.ts";
import { createEstablishmentBodySchema } from "@/schemas/establishment-schema.ts";
import {
	createMenuForNewEstablishmentId,
	createMenuForNewEstablishmentTask
} from "@/tasks/create-menu-for-new-establishment.ts";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.ts";
import { tasks } from "@trigger.dev/sdk";
import z from "zod";

type CreateEstablishmentServiceParams = z.infer<
	typeof createEstablishmentBodySchema
> &
	Pick<ForgetAllListingCacheKeysParams, "paramsToForget">;

export class CreateEstablishmentService {
	private establishmentRepository: IEstablishmentRepository;

	constructor(establishmentRepository: IEstablishmentRepository) {
		this.establishmentRepository = establishmentRepository;
	}

	async handle({
		name,
		address: { postalCode: postal_code, ...address },
		acceptsCreditCard: accepts_credit_card,
		onlyDelivery: only_delivery,
		nextBillingDate: next_billing_date,
		paramsToForget,
		...data
	}: CreateEstablishmentServiceParams): Promise<void> {
		const establishment = await this.establishmentRepository.create({
			...data,
			name,
			slug: slugify(name),
			accepts_credit_card,
			only_delivery,
			next_billing_date,
			address: {
				create: {
					address: {
						create: {
							...address,
							postal_code
						}
					}
				}
			}
		});

		await tasks.trigger<typeof createMenuForNewEstablishmentTask>(
			createMenuForNewEstablishmentId,
			{ establishmentId: establishment.id }
		);

		forgetAllListingCacheKeysEvent.emit("forget-all-listing-cache-keys", {
			baseCacheKey: "establishments",
			paramsToForget
		});
	}
}
