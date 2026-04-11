import z from "zod";

import { Prisma } from "@/generated/prisma/client.js";
import type { IEstablishmentRepository } from "@/interfaces/repositories/establishment-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import { updateEstablishmentBodySchema } from "@/schemas/establishment-schema.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";

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
		address,
		nextBillingDate: next_billing_date,
		acceptsCreditCard: accepts_credit_card,
		onlyDelivery: only_delivery,
		paramsToForget,
		...data
	}: UpdateEstablishmentRequest) {
		const updateInput: Prisma.EstablishmentUpdateInput = {
			...data,
			next_billing_date,
			accepts_credit_card,
			only_delivery
		};

		if (address) {
			const { postalCode, referencePoint, ...rest } = address;

			updateInput.address = {
				update: {
					address: {
						update: {
							...rest,
							postal_code: postalCode,
							reference_point: referencePoint
						}
					}
				}
			};
		}

		await this.establishmentRepository.update({
			id,
			data: updateInput
		});

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "establishments",
			paramsToForget
		});
	}
}
