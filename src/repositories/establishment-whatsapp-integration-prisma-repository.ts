import {
  type EstablishmentWhatsappIntegration,
  WhatsappConnectionStatus,
} from "@/generated/prisma/client.js";
import type {
  IEstablishmentWhatsappIntegrationRepository,
  UpdateWhatsappIntegrationStatusParams,
  UpsertWhatsappIntegrationParams,
} from "@/interfaces/repositories/establishment-whatsapp-integration-repository.js";
import prisma from "@/lib/prisma.js";

export class EstablishmentWhatsappIntegrationPrismaRepository
  implements IEstablishmentWhatsappIntegrationRepository
{
  async findByEstablishmentId(
    establishmentId: string,
  ): Promise<EstablishmentWhatsappIntegration | null> {
    return await prisma.establishmentWhatsappIntegration.findFirst({
      where: { establishment_id: establishmentId, deleted_at: null },
    });
  }

  async findByInstanceName(
    instanceName: string,
  ): Promise<EstablishmentWhatsappIntegration | null> {
    return await prisma.establishmentWhatsappIntegration.findFirst({
      where: { instance_name: instanceName, deleted_at: null },
    });
  }

  async upsert({
    establishmentId,
    instanceName,
    instanceToken,
    status,
  }: UpsertWhatsappIntegrationParams): Promise<EstablishmentWhatsappIntegration> {
    return await prisma.establishmentWhatsappIntegration.upsert({
      where: { establishment_id: establishmentId },
      create: {
        instance_name: instanceName,
        instance_token: instanceToken ?? null,
        status: status ?? WhatsappConnectionStatus.DISCONNECTED,
        establishment: { connect: { id: establishmentId } },
      },
      update: {
        instance_name: instanceName,
        ...(instanceToken !== undefined ? { instance_token: instanceToken } : {}),
        ...(status ? { status } : {}),
        deleted_at: null,
      },
    });
  }

  async updateStatus({
    establishmentId,
    status,
    connectedNumber,
  }: UpdateWhatsappIntegrationStatusParams): Promise<void> {
    await prisma.establishmentWhatsappIntegration.update({
      where: { establishment_id: establishmentId },
      data: {
        status,
        connected_number: connectedNumber ?? null,
        ...(status === WhatsappConnectionStatus.CONNECTED
          ? { last_connected_at: new Date() }
          : {}),
      },
    });
  }

  async softDeleteByEstablishmentId(establishmentId: string): Promise<void> {
    await prisma.establishmentWhatsappIntegration.updateMany({
      where: { establishment_id: establishmentId, deleted_at: null },
      data: {
        deleted_at: new Date(),
        status: WhatsappConnectionStatus.DISCONNECTED,
        connected_number: null,
      },
    });
  }

  async clearInstanceToken(establishmentId: string): Promise<void> {
    await prisma.establishmentWhatsappIntegration.updateMany({
      where: { establishment_id: establishmentId, deleted_at: null },
      data: {
        instance_token: null,
        status: WhatsappConnectionStatus.DISCONNECTED,
        connected_number: null,
      },
    });
  }
}
