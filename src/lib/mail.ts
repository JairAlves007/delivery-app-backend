import { Resend } from "resend";

import { env } from "@/env.js";

export const mail = new Resend(env.RESEND_API_KEY);
