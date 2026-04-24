import z from "zod";

import { TagType } from "@/generated/prisma/client.js";

import {
	establishmentIdSchema,
	listQueryParamsSchema
} from "./generic-schema.js";

export const createTagBodySchema = z.object({
	type: z.enum(TagType, { error: "O tipo da tag é inválido" }),
	label: z
		.string()
		.trim()
		.min(1, "O rótulo deve ser preenchido")
		.max(255, "O rótulo deve ter no máximo 255 caracteres"),
	establishmentId: establishmentIdSchema,
	combinableTagIds: z.array(z.coerce.number().int().positive()).optional()
});

z.globalRegistry.add(createTagBodySchema, { id: "CreateTagBody" });

export const updateTagBodySchema = createTagBodySchema.partial().extend({
	establishmentId: createTagBodySchema.shape.establishmentId
});

z.globalRegistry.add(updateTagBodySchema, { id: "UpdateTagBody" });

export const tagParamsSchema = z.object({
	id: z.coerce
		.number()
		.int("O id da tag deve ser um número inteiro")
		.positive("O id da tag deve ser um número positivo")
});

export const listTagsQueryParamsSchema = listQueryParamsSchema.extend({
	type: z.enum(TagType).optional()
});
