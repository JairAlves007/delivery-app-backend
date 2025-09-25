import { env } from "@/env.ts";
import { Resend } from "resend";

export const mail = new Resend(env.RESEND_API_KEY);
