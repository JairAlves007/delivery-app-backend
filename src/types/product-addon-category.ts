import type { Prisma } from "@/generated/prisma/client.js";

export type ProductAddonCategoryFromRepository =
  Prisma.ProductAddonCategoryGetPayload<{
    include: {
      addonCategory: {
        include: {
          addons: true;
        };
      };
    };
  }>;

export type ProductAddonCategoryWithProductFromRepository =
  Prisma.ProductAddonCategoryGetPayload<{
    include: {
      product: true;
      addonCategory: {
        include: {
          addons: true;
        };
      };
    };
  }>;
