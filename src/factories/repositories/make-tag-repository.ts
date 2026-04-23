import { TagPrismaRepository } from "@/repositories/tag-prisma-repository.js";

export const makeTagRepository = () => {
	return new TagPrismaRepository();
};
