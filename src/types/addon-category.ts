import { Prisma } from "@/generated/prisma/client.js";

export type AddonCategoryFromRepository = Prisma.AddonCategoryGetPayload<{
  include: {
    addons: true;
  };
}>;
