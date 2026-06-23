import type { Prisma } from "@/generated/prisma/client.js";
import type { EstablishmentID } from "@/types/establishment.js";

export type TagCombinationWithTags = Prisma.TagCombinationGetPayload<{
  include: { from_tag: true; to_tag: true };
}>;

export interface ITagCombinationRepository {
  listByEstablishment(
    establishmentId: EstablishmentID,
  ): Promise<TagCombinationWithTags[]>;
  countTagsInEstablishment(
    tagIds: number[],
    establishmentId: EstablishmentID,
  ): Promise<number>;
  exists(fromTagId: number, toTagId: number): Promise<boolean>;
  create(fromTagId: number, toTagId: number): Promise<void>;
  deleteById(id: number, establishmentId: EstablishmentID): Promise<void>;
}
