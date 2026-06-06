import { z } from "zod";

export const uploadDigitalMenuBodySchema = z.object({
  fileBase64: z.string().min(1, "O arquivo do cardápio deve ser preenchido"),
  mimeType: z.string().min(1, "O tipo do arquivo deve ser preenchido"),
});

export const digitalMenuSlugParamsSchema = z.object({
  slug: z.string().min(1, "O slug do estabelecimento deve ser preenchido"),
});
