import type {
  DigitalMenuSource,
  EstablishmentDigitalMenu,
} from "@/generated/prisma/client.js";
import type { DigitalMenuRenderSource } from "@/types/digital-menu.js";

export type UpsertDigitalMenuParams = {
  establishmentId: string;
  source: DigitalMenuSource;
};

export type MarkDigitalMenuReadyParams = {
  establishmentId: string;
  filePath: string;
  fileKey: string;
};

export interface IDigitalMenuRepository {
  findByEstablishmentId(
    establishmentId: string,
  ): Promise<EstablishmentDigitalMenu | null>;
  findReadyByEstablishmentSlug(
    slug: string,
  ): Promise<EstablishmentDigitalMenu | null>;
  findRenderSourceByEstablishmentId(
    establishmentId: string,
  ): Promise<DigitalMenuRenderSource | null>;
  upsert(params: UpsertDigitalMenuParams): Promise<EstablishmentDigitalMenu>;
  markProcessing(establishmentId: string): Promise<void>;
  markReady(params: MarkDigitalMenuReadyParams): Promise<void>;
  markFailed(establishmentId: string): Promise<void>;
}
