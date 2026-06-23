import z from "zod";

export const createTagCombinationBodySchema = z
  .object({
    fromTagId: z.coerce
      .number("A tag de origem deve ser preenchida")
      .int()
      .min(1, "A tag de origem deve ser preenchida"),
    toTagId: z.coerce
      .number("A tag sugerida deve ser preenchida")
      .int()
      .min(1, "A tag sugerida deve ser preenchida"),
  })
  .refine((data) => data.fromTagId !== data.toTagId, {
    path: ["toTagId"],
    message: "A tag sugerida deve ser diferente da tag de origem",
  });

z.globalRegistry.add(createTagCombinationBodySchema, {
  id: "CreateTagCombinationBody",
});

export const tagCombinationParamsSchema = z.object({
  id: z.coerce.number("O id deve ser preenchido").int().min(1),
});
