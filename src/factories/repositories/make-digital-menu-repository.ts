import { DigitalMenuPrismaRepository } from "@/repositories/digital-menu-prisma-repository.js";

export const makeDigitalMenuRepository = () => {
  return new DigitalMenuPrismaRepository();
};
