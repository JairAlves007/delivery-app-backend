import nodemailer from "nodemailer";

import { env } from "@/env.js";

const hasAuth = env.SMTP_USER.length > 0 && env.SMTP_PASS.length > 0;

export const mailTransporter = nodemailer.createTransport({
	host: env.SMTP_HOST,
	port: env.SMTP_PORT,
	secure: env.SMTP_SECURE,
	...(hasAuth ? { auth: { user: env.SMTP_USER, pass: env.SMTP_PASS } } : {}),
	pool: true,
	maxConnections: 5,
	maxMessages: 100,
	ignoreTLS: !env.SMTP_SECURE && !hasAuth
});
