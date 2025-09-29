import { fileMimeTypeValues } from "@/types/resource.ts";
import { ForObjectResourceType, ResourceType } from "@prisma/client";
import z from "zod";
import { establishmentIdSchema } from "./generic-schema.ts";

export const uploadSignedUrlBodySchema = z.object({
	resources: z.array(
		z.object({
			width: z.coerce.number("A largura deve ser preenchida"),
			height: z.coerce.number("A altura deve ser preenchida"),
			forResource: z
				.string()
				.enumCaseInsensitive(
					ForObjectResourceType,
					"Precisamos saber para qual recurso pertencem as imagens"
				),
			fileMimeType: z.enum(
				Object.values(fileMimeTypeValues),
				"Tipo de arquivo inválido"
			),
			resourceType: z
				.string()
				.enumCaseInsensitive(ResourceType, "Tipo de recurso inválido")
		})
	),
	establishmentId: establishmentIdSchema
});
