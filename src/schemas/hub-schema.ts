import z from "zod";

import { TagType } from "@/generated/prisma/client.js";
import Constants from "@/helpers/constants.js";

export const hubListEstablishmentsQuerySchema = z.object({
  search: z.string().trim().max(255).optional().nullable(),
  cuisine: z.enum(TagType).optional().nullable(),
  openNow: z.stringbool().optional(),
  paginationMode: z.enum(["offset", "cursor"]).default("offset"),
  page: z.coerce.number().int().min(1, "Pagina inválida").optional(),
  perPage: z.coerce
    .number()
    .int()
    .min(1, "Limite inválido")
    .max(Constants.MAX_LISTING_LIMIT)
    .default(12),
  limit: z.coerce
    .number()
    .int()
    .min(1, "Limite inválido")
    .max(Constants.MAX_LISTING_LIMIT)
    .default(12),
  cursor: z.ulid("Cursor inválido").nullable().optional(),
});
