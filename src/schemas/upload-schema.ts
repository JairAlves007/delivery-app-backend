import Constants from "@/helpers/constants.ts";
import z from "zod";

export const uploadSignedUrlBodySchema = z.object({
	contentType: z
		.string()
		.min(1, "O contentType deve ser preenchido")
		.regex(Constants.MIME_TYPE_REGEX, "Formato de arquivo inválido")
});
