import { makeEstablishmentRepository } from "@/factories/repositories/make-establishment-repository.js";
import { ListHubEstablishmentsService } from "@/services/hub/list-hub-establishments-service.js";

export const makeListHubEstablishmentsService = () => {
  const establishmentRepository = makeEstablishmentRepository();
  return new ListHubEstablishmentsService(establishmentRepository);
};
