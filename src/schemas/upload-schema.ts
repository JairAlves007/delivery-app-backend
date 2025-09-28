import { fileMimeTypeValues } from "@/types/resource.ts";
import { ForObjectResourceType, ResourceFileType } from "@prisma/client";
import z from "zod";

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
				.enumCaseInsensitive(ResourceFileType, "Tipo de recurso inválido")
		})
	)
});
