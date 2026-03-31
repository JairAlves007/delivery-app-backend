import "dotenv/config";

import z from "zod";

const envSchema = z.object({
	NODE_ENV: z.enum(["development", "production"]).default("development"),
	PORT: z.coerce.number().default(3333),
	BASE_URL: z.url("Base url is required").default("http://localhost:3333"),
	ALLOWED_ORIGINS: z
		.string()
		.default("https://app.delivery.com.br,https://admin.delivery.com.br"),
	PUBLIC_BUCKET_URL: z
		.url("Public bucket url is required")
		.min(1, "Public bucket url is required"),
	APP_URL: z.url("App url is required").min(1, "App url is required"),
	DATABASE_URL: z.url(),
	DATABASE_USER: z.string().min(1, "Database user is required"),
	DATABASE_PASSWORD: z.string().min(1, "Database password is required"),
	DATABASE_NAME: z.string().min(1, "Database name is required"),
	JWT_SECRET: z.string().min(32, "JWT secret must be at least 32 characters"),
	CLOUDFLARE_ENDPOINT: z.url("Cloudflare endpoint is required"),
	CLOUDFLARE_ACCESS_KEY_ID: z
		.string()
		.min(1, "Cloudflare access key id is required"),
	CLOUDFLARE_SECRET_ACCESS_KEY: z
		.string()
		.min(1, "Cloudflare secret access key is required"),
	CLOUDFLARE_BUCKET_NAME: z
		.string()
		.min(1, "Cloudflare bucket name is required"),
	REDIS_HOST: z.string().default("127.0.0.1"),
	REDIS_PORT: z.coerce.number().default(6379),
	REDIS_PASSWORD: z.string().optional(),
	RESEND_API_KEY: z.string().min(1, "Resend api key is required")
});

export const env = envSchema.parse(process.env);
