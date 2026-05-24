import z from "zod";

export const manualClosureBodySchema = z
	.object({
		reason: z
			.string()
			.trim()
			.max(500, "A razão deve ter no máximo 500 caracteres")
			.optional(),
		endsAt: z.coerce.date("Data de término inválida").optional()
	})
	.superRefine((data, ctx) => {
		if (data.endsAt && data.endsAt <= new Date()) {
			ctx.addIssue({
				code: "custom",
				message: "A data de término deve ser futura",
				path: ["endsAt"]
			});
		}
	});

z.globalRegistry.add(manualClosureBodySchema, { id: "ManualClosureBody" });

export const establishmentClosureParamsSchema = z.object({
	id: z.ulid().min(1, "O id do estabelecimento deve ser preenchido")
});
