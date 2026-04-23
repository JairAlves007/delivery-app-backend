import type { z } from "zod";

import type { Prisma } from "@/generated/prisma/client.js";
import type { tagResponseSchema } from "@/schemas/response-schema.js";

export type TagFromRepository = Prisma.TagGetPayload<object>;

export type TagList = z.infer<typeof tagResponseSchema>;
