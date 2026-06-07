import { makeEstablishmentRepository } from "@/factories/repositories/make-establishment-repository.js";
import { CheckBillingDueNotificationsService } from "@/services/notification/check-billing-due-notifications-service.js";

export const makeCheckBillingDueNotificationsService = () => {
  const establishmentRepository = makeEstablishmentRepository();

  return new CheckBillingDueNotificationsService(establishmentRepository);
};
