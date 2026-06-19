import z from "zod";

import {
  ForObjectResourceType,
  ResourceType,
} from "@/generated/prisma/client.js";
import Constants from "@/helpers/constants.js";
import { fileMimeTypeValues } from "@/types/resource.js";

export const uploadSignedUrlBodySchema = z.object({
  objectId: z
    .ulid("O id do recurso deve ser preenchido corretamente")
    .min(1, "O id do recurso deve ser preenchido"),
  size: z.coerce
    .number("O tamanho do arquivo deve ser informado")
    .int("O tamanho do arquivo é inválido")
    .positive("O tamanho do arquivo é inválido")
    .max(
      Constants.MAX_UPLOAD_FILE_SIZE_BYTES,
      "O arquivo excede o tamanho máximo permitido",
    ),
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

export const deleteResourceParamsSchema = z.object({
  resourceId: z.ulid("O id do recurso deve ser preenchido corretamente"),
});
