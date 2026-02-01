import { EstablishmentDoesNotAcceptCardError } from "@/errors/establishment/does-not-accept-card-error.ts";
import { EstablishmentNotFound } from "@/errors/establishment/not-found-error.ts";
import { EstablishmentIsOnlyDeliveryError } from "@/errors/establishment/only-delivery-error.ts";
import { makeFindEstablishmentByIdService } from "@/factories/services/establishment/make-find-establishment-by-id-service.ts";
import { DeliveryType, PaymentMethodType } from "@/generated/prisma/client.ts";
import type { EstablishmentID } from "@/types/establishment.ts";

type ValidateEstablishmentFromOrderServiceRequest = {
	establishmentId: EstablishmentID;
	paymentMethod: PaymentMethodType;
	deliveryType: DeliveryType;
};

export class ValidateEstablishmentFromOrderService {
	async handle({
		establishmentId,
		paymentMethod,
		deliveryType
	}: ValidateEstablishmentFromOrderServiceRequest) {
		const findEstablishmentByIdService = makeFindEstablishmentByIdService();
		const establishment = await findEstablishmentByIdService.handle({
			id: establishmentId
		});

		if (!establishment) throw new EstablishmentNotFound();

		if (
			!establishment.accepts_credit_card &&
			paymentMethod === PaymentMethodType.CARD
		)
			throw new EstablishmentDoesNotAcceptCardError();

		if (establishment.only_delivery && deliveryType !== DeliveryType.DELIVERY)
			throw new EstablishmentIsOnlyDeliveryError();

		// if (!isEstablishmentOpen(establishment)) throw new EstablishmentIsClosed();
	}
}
