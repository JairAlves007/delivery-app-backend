import { ClosurePrismaRepository } from "@/repositories/closure-prisma-repository.js";

export const makeClosureRepository = () => {
	return new ClosurePrismaRepository();
};
