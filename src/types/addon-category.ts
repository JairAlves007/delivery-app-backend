import { Prisma } from "@/generated/prisma/client.js";

export type AddonCategoryFromRepository = Prisma.AddonCategoryGetPayload<{
  include: {
    addons: true;
  };
}>;

export type AddonCategoryWithProductsFromRepository =
  Prisma.AddonCategoryGetPayload<{
    include: {
      addons: true;
      products: true;
    };
  }>;
