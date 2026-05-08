import z from "zod";

import Constants from "@/helpers/constants.js";

export const establishmentIdSchema = z
  .ulid("O id do estabelecimento deve ser preenchido")
  .min(1, "O id do estabelecimento deve ser preenchido");

export const establishmentParamsSchema = z.object({
  establishmentId: establishmentIdSchema,
});

export const establishmentSlugSchema = z.object({
  slug: z.string().trim().min(1, "O slug deve ser preenchido").max(255),
});

export const sortDirectionSchema = z.enum(
  ["asc", "desc"],
  "Ordenação inválida",
);

z.globalRegistry.add(sortDirectionSchema, { id: "SortDirection" });

export const searchAndOrderBySchema = z.object({
  search: z.string().trim().max(255).optional().nullable(),
  sortField: z.string().trim().max(100).optional().nullable(),
  sortDirection: sortDirectionSchema.optional().nullable(),
});

z.globalRegistry.add(searchAndOrderBySchema, { id: "SearchAndOrderBy" });

export const listQueryParamsSchema = searchAndOrderBySchema.extend({
  page: z.coerce.number().int().min(1, "Pagina inválida").optional(),
  perPage: z.coerce.number().int().min(1, "Limite inválido").default(12),
});

export const listCursorQueryParamsSchema = searchAndOrderBySchema.extend({
  limit: z.coerce.number().int().min(1, "Limite inválido").default(12),
  cursor: z.ulid("Cursor inválido").nullable().optional(),
});

export const paginationResponseSchema = z.object({
  total: z.number(),
  page: z.number(),
  perPage: z.number(),
  totalPages: z.number(),
});

z.globalRegistry.add(paginationResponseSchema, { id: "PaginationResponse" });

export const cursorPaginationResponseSchema = z.object({
  nextCursor: z.string().nullable(),
  hasNextPage: z.boolean(),
});

z.globalRegistry.add(cursorPaginationResponseSchema, {
  id: "CursorPaginationResponse",
});

export const paginatedResponseSchema = <T extends z.ZodTypeAny>(
  itemSchema: T,
) =>
  z.object({
    items: z.array(itemSchema),
    pagination: paginationResponseSchema,
  });

export const cursorPaginatedResponseSchema = <T extends z.ZodTypeAny>(
  itemSchema: T,
) =>
  z.object({
    items: z.array(itemSchema),
    pagination: cursorPaginationResponseSchema,
  });

export const listResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
  });

export const userIdSchema = z
  .ulid("Usuário inválido")
  .min(1, "Usuário inválido");

export const userEmailSchema = z
  .email("Endereço de e-mail inválido")
  .min(1, "Endereço de e-mail inválido")
  .max(320);

export const phoneSchema = z
  .string()
  .min(1, "O telefone deve ser preenchido")
  .max(20, "Telefone inválido")
  .regex(Constants.PHONE_REGEX, "Telefone inválido")
  .transform((val) => val.replace(/\D/g, ""));

export const addressLocationSchema = z.object({
  city: z.string().trim().min(1, "A cidade deve ser preenchida").max(255),
  state: z.string().trim().min(1, "O estado deve ser preenchido").max(255),
  neighborhood: z
    .string()
    .trim()
    .min(1, "O bairro deve ser preenchido")
    .max(255),
  street: z.string().trim().min(1, "A rua deve ser preenchida").max(255),
  phone: phoneSchema,
  number: z.string().trim().max(20).default("S/N").optional().nullable(),
  postalCode: z
    .string()
    .max(10, "CEP inválido")
    .regex(Constants.POSTAL_CODE_REGEX, "CEP inválido")
    .transform((val) => val.replace(/\D/g, "")),
  complement: z.string().trim().max(500).optional().nullable(),
  referencePoint: z.string().trim().max(500).optional().nullable(),
  latitude: z.number("A latitude deve ser preenchida").optional().nullable(),
  longitude: z.number("A longitude deve ser preenchida").optional().nullable(),
});

z.globalRegistry.add(addressLocationSchema, { id: "AddressLocation" });
