import { makeEstablishmentRepository } from "@/factories/repositories/make-establishment-repository.js";
import { FindEstablishmentByIdService } from "@/services/establishment/find-establishment-by-id-service.js";

export const makeFindEstablishmentByIdService = () => {
  const establishmentRepository = makeEstablishmentRepository();
  return new FindEstablishmentByIdService(establishmentRepository);
};
