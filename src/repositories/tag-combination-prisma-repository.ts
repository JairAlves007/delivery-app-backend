import type {
  ITagCombinationRepository,
  TagCombinationWithTags,
} from "@/interfaces/repositories/tag-combination-repository.js";
import prisma from "@/lib/prisma.js";
import type { EstablishmentID } from "@/types/establishment.js";

export class TagCombinationPrismaRepository
  implements ITagCombinationRepository
{
  async listByEstablishment(
    establishmentId: EstablishmentID,
  ): Promise<TagCombinationWithTags[]> {
    return await prisma.tagCombination.findMany({
      where: { from_tag: { establishment_id: establishmentId } },
      include: { from_tag: true, to_tag: true },
      orderBy: { id: "desc" },
    });
  }

  async countTagsInEstablishment(
    tagIds: number[],
    establishmentId: EstablishmentID,
  ): Promise<number> {
    return await prisma.tag.count({
      where: {
        id: { in: tagIds },
        establishment_id: establishmentId,
        deleted_at: null,
      },
    });
  }

  async exists(fromTagId: number, toTagId: number): Promise<boolean> {
    const combination = await prisma.tagCombination.findUnique({
      where: {
        from_tag_id_to_tag_id: {
          from_tag_id: fromTagId,
          to_tag_id: toTagId,
        },
      },
      select: { id: true },
    });

    return combination !== null;
  }

  async create(fromTagId: number, toTagId: number): Promise<void> {
    await prisma.tagCombination.create({
      data: { from_tag_id: fromTagId, to_tag_id: toTagId },
    });
  }

  async deleteById(
    id: number,
    establishmentId: EstablishmentID,
  ): Promise<void> {
    await prisma.tagCombination.deleteMany({
      where: { id, from_tag: { establishment_id: establishmentId } },
    });
  }
}
