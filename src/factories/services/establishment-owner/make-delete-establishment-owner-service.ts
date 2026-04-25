import { makeUserRepository } from "@/factories/repositories/make-user-repository.js";
import { DeleteEstablishmentOwnerService } from "@/services/establishment-owner/delete-establishment-owner-service.js";

export const makeDeleteEstablishmentOwnerService = () => {
  return new DeleteEstablishmentOwnerService(makeUserRepository());
};
