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
		openingHours,
		socialLinks,
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

		if (openingHours !== undefined) {
			await this.establishmentRepository.replaceOpeningHours({
				establishmentId: id,
				items: openingHours.map(h => ({
					day_of_week: h.dayOfWeek,
					opens_at: h.isClosed ? "00:00" : (h.opensAt ?? "00:00"),
					closes_at: h.isClosed ? "00:00" : (h.closesAt ?? "00:00"),
					is_closed: h.isClosed
				}))
			});
		}

		if (socialLinks !== undefined) {
			await this.establishmentRepository.upsertSocialLinks({
				establishmentId: id,
				items: socialLinks.map(link => ({
					platform: link.platform,
					url: link.url
				}))
			});
		}

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "establishments",
			paramsToForget
		});
	}
}
