import z from "zod";

const envSchema = z.object({
	NODE_ENV: z.enum(["development", "production"]).default("development"),
	PORT: z.coerce.number().default(3000),
	BASE_URL: z.url().default("http://localhost:3000"),
	CORS_ORIGIN: z.string().default("*"),
	PUBLIC_BUCKET_URL: z
		.url("Public bucket url is required")
		.min(1, "Public bucket url is required"),
	DATABASE_URL: z.url(),
	JWT_SECRET: z.string().min(1, "JWT secret is required"),
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
	REDIS_PASSWORD: z.string().optional()
});

export const env = envSchema.parse(process.env);
