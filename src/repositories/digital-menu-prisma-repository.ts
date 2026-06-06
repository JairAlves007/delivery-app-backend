import {
  DigitalMenuStatus,
  type EstablishmentDigitalMenu,
} from "@/generated/prisma/client.js";
import type {
  IDigitalMenuRepository,
  MarkDigitalMenuReadyParams,
  UpsertDigitalMenuParams,
} from "@/interfaces/repositories/digital-menu-repository.js";
import prisma from "@/lib/prisma.js";
import type { DigitalMenuRenderSource } from "@/types/digital-menu.js";

export class DigitalMenuPrismaRepository implements IDigitalMenuRepository {
  async findByEstablishmentId(
    establishmentId: string,
  ): Promise<EstablishmentDigitalMenu | null> {
    return await prisma.establishmentDigitalMenu.findFirst({
      where: { establishment_id: establishmentId, deleted_at: null },
    });
  }

  async findReadyByEstablishmentSlug(
    slug: string,
  ): Promise<EstablishmentDigitalMenu | null> {
    return await prisma.establishmentDigitalMenu.findFirst({
      where: {
        status: DigitalMenuStatus.READY,
        deleted_at: null,
        establishment: { slug, deleted_at: null },
      },
    });
  }

  async findRenderSourceByEstablishmentId(
    establishmentId: string,
  ): Promise<DigitalMenuRenderSource | null> {
    return await prisma.establishment.findFirst({
      where: { id: establishmentId, deleted_at: null },
      include: {
        address: {
          select: {
            address: true,
          },
        },
        resources: {
          select: {
            resource: true,
          },
        },
        categories: {
          where: { deleted_at: null },
          orderBy: { order: "asc" },
          include: {
            products: {
              where: {
                deleted_at: null,
                OR: [{ valid_until: null }, { valid_until: { gte: new Date() } }],
              },
              orderBy: { name: "asc" },
            },
          },
        },
      },
    });
  }

  async upsert({
    establishmentId,
    source,
  }: UpsertDigitalMenuParams): Promise<EstablishmentDigitalMenu> {
    return await prisma.establishmentDigitalMenu.upsert({
      where: { establishment_id: establishmentId },
      create: {
        source,
        status: DigitalMenuStatus.PENDING,
        establishment: { connect: { id: establishmentId } },
      },
      update: {
        source,
        status: DigitalMenuStatus.PENDING,
        deleted_at: null,
      },
    });
  }

  async markProcessing(establishmentId: string): Promise<void> {
    await prisma.establishmentDigitalMenu.update({
      where: { establishment_id: establishmentId },
      data: { status: DigitalMenuStatus.PROCESSING },
    });
  }

  async markReady({
    establishmentId,
    filePath,
    fileKey,
  }: MarkDigitalMenuReadyParams): Promise<void> {
    await prisma.establishmentDigitalMenu.update({
      where: { establishment_id: establishmentId },
      data: {
        status: DigitalMenuStatus.READY,
        file_path: filePath,
        file_key: fileKey,
        generated_at: new Date(),
      },
    });
  }

  async markFailed(establishmentId: string): Promise<void> {
    await prisma.establishmentDigitalMenu.update({
      where: { establishment_id: establishmentId },
      data: { status: DigitalMenuStatus.FAILED },
    });
  }
}
