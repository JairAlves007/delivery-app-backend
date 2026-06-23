import { TagCombinationPrismaRepository } from "@/repositories/tag-combination-prisma-repository.js";

export const makeTagCombinationRepository = () => {
  return new TagCombinationPrismaRepository();
};
