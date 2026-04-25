import { makeUserRepository } from "@/factories/repositories/make-user-repository.js";
import { FindEstablishmentOwnerService } from "@/services/establishment-owner/find-establishment-owner-service.js";

export const makeFindEstablishmentOwnerService = () => {
  return new FindEstablishmentOwnerService(makeUserRepository());
};
