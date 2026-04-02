import type { z } from "zod";

import type { Prisma } from "@/generated/prisma/client.js";
import type { productResponseSchema } from "@/schemas/response-schema.js";

export type ProductFromRepository = Prisma.ProductGetPayload<{
	include: {
		resources: {
			select: {
				resource: true;
			};
		};
	};
}>;

export type ProductList = z.infer<typeof productResponseSchema>;
