import type { z } from "zod";

import type { Prisma } from "@/generated/prisma/client.js";
import type {
  productDetailResponseSchema,
  productResponseSchema,
} from "@/schemas/response-schema.js";

export type ProductFromRepository = Prisma.ProductGetPayload<{
  include: {
    resources: {
      select: {
        resource: true;
      };
    };
    tags: {
      select: {
        tag: true;
      };
    };
  };
}>;

export type ProductWithAddonCategoriesFromRepository =
  Prisma.ProductGetPayload<{
    include: {
      resources: {
        select: {
          resource: true;
        };
      };
      tags: {
        select: {
          tag: true;
        };
      };
      addonCategories: {
        include: {
          addonCategory: {
            include: {
              addons: true;
            };
          };
        };
      };
    };
  }>;

export type ProductList = z.infer<typeof productResponseSchema>;

export type ProductDetail = z.infer<typeof productDetailResponseSchema>;
