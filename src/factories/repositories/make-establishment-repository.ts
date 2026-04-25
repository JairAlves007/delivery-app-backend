import { EstablishmentPrismaRepository } from "@/repositories/establishment-prisma-repository.js";

export const makeEstablishmentRepository = () => {
  return new EstablishmentPrismaRepository();
};
