import { makeUserRepository } from "@/factories/repositories/make-user-repository.js";
import { ListEstablishmentOwnerService } from "@/services/establishment-owner/list-establishment-owner-service.js";

export const makeListEstablishmentOwnerService = () => {
  return new ListEstablishmentOwnerService(makeUserRepository());
};
