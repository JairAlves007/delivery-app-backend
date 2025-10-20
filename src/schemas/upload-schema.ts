import { fileMimeTypeValues } from "@/types/resource.ts";
import { ForObjectResourceType, ResourceType } from "@prisma/client";
import z from "zod";
import { establishmentIdSchema } from "./generic-schema.ts";

export const uploadSignedUrlBodySchema = z.object({
	objectId: z
		.ulid("O id do recurso deve ser preenchido corretamente")
		.min(1, "O id do recurso deve ser preenchido"),
	resourceId: z
		.ulid("O id do recurso deve ser preenchido corretamente")
		.min(1, "O id do recurso deve ser preenchido")
		.optional()
		.nullable(),
	establishmentId: establishmentIdSchema,
	resource: z.object({
		width: z.coerce.number("A largura deve ser preenchida"),
		height: z.coerce.number("A altura deve ser preenchida"),
		for: z
			.string()
			.enumCaseInsensitive(
				ForObjectResourceType,
				"Precisamos saber para qual recurso pertencem as imagens"
			),
		mimeType: z.enum(
			Object.values(fileMimeTypeValues),
			"Tipo de arquivo inválido"
		),
		type: z
			.string()
			.enumCaseInsensitive(ResourceType, "Tipo de recurso inválido")
	})
});
