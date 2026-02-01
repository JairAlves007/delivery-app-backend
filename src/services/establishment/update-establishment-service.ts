import { forgetAllListingCacheKeysEvent } from "@/events/forget-listing-cache-keys-event.ts";
import { Prisma } from "@/generated/prisma/client.ts";
import { slugify } from "@/helpers/utils.ts";
import type { IEstablishmentRepository } from "@/interfaces/repositories/establishment-repository.ts";
import { updateEstablishmentBodySchema } from "@/schemas/establishment-schema.ts";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.ts";
import z from "zod";

interface UpdateEstablishmentRequest
	extends
		z.infer<typeof updateEstablishmentBodySchema>,
		Pick<ForgetAllListingCacheKeysParams, "paramsToForget"> {
	id: string;
}

export class UpdateEstablishmentService {
	private establishmentRepository: IEstablishmentRepository;

	constructor(establishmentRepository: IEstablishmentRepository) {
		this.establishmentRepository = establishmentRepository;
	}

	async handle({
		id,
		name,
		address,
		nextBillingDate: next_billing_date,
		paramsToForget,
		...data
	}: UpdateEstablishmentRequest) {
		const updateInput: Prisma.EstablishmentUpdateInput = {
			...data,
			next_billing_date,
			...(!!name && { slug: slugify(name) })
		};

		if (address) {
			const { postalCode, ...rest } = address;

			updateInput.address = {
				update: {
					address: {
						update: {
							...rest,
							postal_code: postalCode
						}
					}
				}
			};
		}

		await this.establishmentRepository.update({
			id,
			data: updateInput
		});

		forgetAllListingCacheKeysEvent.emit("forget-all-listing-cache-keys", {
			baseCacheKey: "establishments",
			paramsToForget
		});
	}
}
