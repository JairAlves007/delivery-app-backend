import { TypedEventEmitter } from "@/classes/event-emitter.ts";
import { resetPasswordMailBodySchema } from "@/schemas/mail-schema.ts";
import z from "zod";

export type SendResetPasswordMailEventType = z.infer<
	typeof resetPasswordMailBodySchema
>;

type SendResetPasswordMailParams = {
	"send-reset-password-mail": SendResetPasswordMailEventType;
};

export const sendResetPasswordMailEvent =
	new TypedEventEmitter<SendResetPasswordMailParams>();
