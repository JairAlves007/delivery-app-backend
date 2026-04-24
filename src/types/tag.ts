import type { z } from "zod";

import type { Prisma } from "@/generated/prisma/client.js";
import type {
	tagDetailResponseSchema,
	tagResponseSchema
} from "@/schemas/response-schema.js";

export type TagFromRepository = Prisma.TagGetPayload<object>;

export type TagWithCombinationsFromRepository = Prisma.TagGetPayload<{
	include: {
		fromTags: {
			include: {
				to_tag: true;
			};
		};
	};
}>;

export type TagList = z.infer<typeof tagResponseSchema>;
export type TagDetail = z.infer<typeof tagDetailResponseSchema>;
