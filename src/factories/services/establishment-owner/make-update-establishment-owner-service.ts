import { makeEstablishmentRepository } from "@/factories/repositories/make-establishment-repository.js";
import { makeUserRepository } from "@/factories/repositories/make-user-repository.js";
import { UpdateEstablishmentOwnerService } from "@/services/establishment-owner/update-establishment-owner-service.js";

export const makeUpdateEstablishmentOwnerService = () => {
  return new UpdateEstablishmentOwnerService(
    makeUserRepository(),
    makeEstablishmentRepository(),
  );
};
