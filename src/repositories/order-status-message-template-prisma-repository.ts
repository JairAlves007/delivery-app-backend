import type {
  OrderStatusMessageTemplate,
  OrderStatusType,
} from "@/generated/prisma/client.js";
import type {
  IOrderStatusMessageTemplateRepository,
  UpsertOrderStatusMessageTemplateParams,
} from "@/interfaces/repositories/order-status-message-template-repository.js";
import prisma from "@/lib/prisma.js";

export class OrderStatusMessageTemplatePrismaRepository
  implements IOrderStatusMessageTemplateRepository
{
  async findByEstablishmentAndStatus({
    establishmentId,
    status,
  }: {
    establishmentId: string;
    status: OrderStatusType;
  }): Promise<OrderStatusMessageTemplate | null> {
    return await prisma.orderStatusMessageTemplate.findFirst({
      where: {
        establishment_id: establishmentId,
        status,
        deleted_at: null,
      },
    });
  }

  async listByEstablishment(
    establishmentId: string,
  ): Promise<OrderStatusMessageTemplate[]> {
    return await prisma.orderStatusMessageTemplate.findMany({
      where: { establishment_id: establishmentId, deleted_at: null },
      orderBy: { status: "asc" },
    });
  }

  async upsert({
    establishmentId,
    status,
    body,
    isActive,
  }: UpsertOrderStatusMessageTemplateParams): Promise<OrderStatusMessageTemplate> {
    return await prisma.orderStatusMessageTemplate.upsert({
      where: {
        establishment_id_status: { establishment_id: establishmentId, status },
      },
      create: {
        status,
        body,
        is_active: isActive ?? true,
        establishment: { connect: { id: establishmentId } },
      },
      update: {
        body,
        ...(isActive !== undefined ? { is_active: isActive } : {}),
        deleted_at: null,
      },
    });
  }

  async softDelete({
    establishmentId,
    status,
  }: {
    establishmentId: string;
    status: OrderStatusType;
  }): Promise<void> {
    await prisma.orderStatusMessageTemplate.updateMany({
      where: {
        establishment_id: establishmentId,
        status,
        deleted_at: null,
      },
      data: { deleted_at: new Date() },
    });
  }
}
