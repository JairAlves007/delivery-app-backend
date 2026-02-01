import {
	baseMailSchema,
	resetPasswordMailBodySchema
} from "@/schemas/mail-schema.ts";
import z from "zod";

export type BaseMailData = z.infer<typeof baseMailSchema>;

export type ResetPasswordMailData = z.infer<typeof resetPasswordMailBodySchema>;

export type SendResetPasswordMailEventType = z.infer<
	typeof resetPasswordMailBodySchema
>;
