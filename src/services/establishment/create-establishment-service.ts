import { createMenuForNewEstablishmentEvent } from "@/events/create-menu-for-new-establishment-event.ts";
import { slugify } from "@/helpers/utils.ts";
import type { IEstablishmentRepository } from "@/interfaces/repositories/establishment-repository.ts";
import { createEstablishmentBodySchema } from "@/schemas/establishment-schema.ts";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.ts";
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

		createMenuForNewEstablishmentEvent.emit(
			"create-menu-for-new-establishment",
			{
				establishmentId: establishment.id,
				paramsToForget
			}
		);
	}
}
