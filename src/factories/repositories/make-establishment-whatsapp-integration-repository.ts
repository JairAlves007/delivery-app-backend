import { EstablishmentWhatsappIntegrationPrismaRepository } from "@/repositories/establishment-whatsapp-integration-prisma-repository.js";

export const makeEstablishmentWhatsappIntegrationRepository = () => {
  return new EstablishmentWhatsappIntegrationPrismaRepository();
};
