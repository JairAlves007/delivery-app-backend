import { z } from "zod";

export const apiSuccessResponseSchema = <T extends z.ZodTypeAny>(
	detailsSchema: T
) =>
	z.object({
		success: z.literal(true),
		message: z.string(),
		details: detailsSchema.optional()
	});

export const apiErrorResponseSchema = <T extends z.ZodTypeAny>(
	detailsSchema: T
) =>
	z.object({
		success: z.literal(false),
		code: z.string(),
		details: detailsSchema
	});

export const apiDefaultErrorResponseSchema = apiErrorResponseSchema(
	z.object({
		error: z.object({
			message: z.string()
		})
	})
);

export const apiValidationErrorResponseSchema = apiErrorResponseSchema(
	z.union([
		z.object({
			error: z.object({
				message: z.string(),
				issues: z
					.array(
						z.object({
							code: z.string().optional(),
							message: z.string().optional(),
							path: z.array(z.string()).optional()
						})
					)
					.optional()
			})
		}),
		z.array(
			z.object({
				field: z.string(),
				message: z.string()
			})
		)
	])
);

export const apiNoContentResponseSchema = apiSuccessResponseSchema(
	z.object({})
);

export const apiEmptyDetailsResponseSchema = apiSuccessResponseSchema(
	z.object({})
);
