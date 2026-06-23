import { ComboPrismaRepository } from "@/repositories/combo-prisma-repository.js";

export const makeComboRepository = () => {
  return new ComboPrismaRepository();
};
