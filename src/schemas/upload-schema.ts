import z from "zod";

import {
  ForObjectResourceType,
  ResourceType,
} from "@/generated/prisma/client.js";
import { fileMimeTypeValues } from "@/types/resource.js";

export const uploadSignedUrlBodySchema = z.object({
  objectId: z
    .ulid("O id do recurso deve ser preenchido corretamente")
    .min(1, "O id do recurso deve ser preenchido"),
  resourceId: z
    .ulid("O id do recurso deve ser preenchido corretamente")
    .min(1, "O id do recurso deve ser preenchido")
    .optional()
    .nullable(),
  resource: z.object({
    width: z.coerce.number("A largura deve ser preenchida"),
    height: z.coerce.number("A altura deve ser preenchida"),
    for: z.enum(
      ForObjectResourceType,
      "Precisamos saber para qual recurso pertencem as imagens",
    ),
    mimeType: z.enum(
      Object.values(fileMimeTypeValues),
      "Tipo de arquivo inválido",
    ),
    type: z.enum(ResourceType, "Tipo de recurso inválido"),
  }),
});

z.globalRegistry.add(uploadSignedUrlBodySchema, { id: "UploadSignedUrlBody" });

export const uploadResourceRulesQuerySchema = z.object({
  forObject: z.enum(
    ForObjectResourceType,
    "Precisamos saber para qual recurso pertencem as imagens",
  ),
});
