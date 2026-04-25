import { makeEstablishmentRepository } from "@/factories/repositories/make-establishment-repository.js";
import { makeRoleRepository } from "@/factories/repositories/make-role-repository.js";
import { makeUserRepository } from "@/factories/repositories/make-user-repository.js";
import { CreateEstablishmentOwnerService } from "@/services/establishment-owner/create-establishment-owner-service.js";

export const makeCreateEstablishmentOwnerService = () => {
  return new CreateEstablishmentOwnerService(
    makeUserRepository(),
    makeRoleRepository(),
    makeEstablishmentRepository(),
  );
};
