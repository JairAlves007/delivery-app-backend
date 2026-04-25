import { makeEstablishmentRepository } from "@/factories/repositories/make-establishment-repository.js";
import { DeleteEstablishmentService } from "@/services/establishment/delete-establishment-service.js";

export const makeDeleteEstablishmentService = () => {
  const establishmentRepository = makeEstablishmentRepository();
  return new DeleteEstablishmentService(establishmentRepository);
};
