import { makeEstablishmentRepository } from "@/factories/repositories/make-establishment-repository.js";
import { ListEstablishmentService } from "@/services/establishment/list-establishment-service.js";

export const makeListEstablishmentService = () => {
  const establishmentRepository = makeEstablishmentRepository();
  return new ListEstablishmentService(establishmentRepository);
};
