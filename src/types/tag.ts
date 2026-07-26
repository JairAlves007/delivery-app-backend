import type { z } from "zod";

import type { Prisma } from "@/generated/prisma/client.js";
import type { tagDetailResponseSchema } from "@/schemas/response-schema.js";

export type TagWithCombinationsFromRepository = Prisma.TagGetPayload<{
  include: {
    fromTags: {
      include: {
        to_tag: true;
      };
    };
  };
}>;

export type TagDetail = z.infer<typeof tagDetailResponseSchema>;
