import type { z } from "zod";

import type { Prisma } from "@/generated/prisma/client.js";
import type { productCategoryResponseSchema } from "@/schemas/response-schema.js";

export type ProductCategoryFromRepository = Prisma.ProductCategoryGetPayload<{
  include: {
    resources: {
      select: {
        resource: true;
      };
    };
  };
}>;

export type ProductCategoryList = z.infer<typeof productCategoryResponseSchema>;
