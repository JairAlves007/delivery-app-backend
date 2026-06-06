import type {
  EstablishmentWhatsappIntegration,
  WhatsappConnectionStatus,
} from "@/generated/prisma/client.js";

export type UpsertWhatsappIntegrationParams = {
  establishmentId: string;
  instanceName: string;
  instanceToken?: string | null;
  status?: WhatsappConnectionStatus;
};

export type UpdateWhatsappIntegrationStatusParams = {
  establishmentId: string;
  status: WhatsappConnectionStatus;
  connectedNumber?: string | null;
};

export interface IEstablishmentWhatsappIntegrationRepository {
  findByEstablishmentId(
    establishmentId: string,
  ): Promise<EstablishmentWhatsappIntegration | null>;
  findByInstanceName(
    instanceName: string,
  ): Promise<EstablishmentWhatsappIntegration | null>;
  upsert(
    params: UpsertWhatsappIntegrationParams,
  ): Promise<EstablishmentWhatsappIntegration>;
  updateStatus(params: UpdateWhatsappIntegrationStatusParams): Promise<void>;
}
