import z from "zod";

const envSchema = z.object({
	PORT: z.coerce.number().default(3000),
	NODE_ENV: z.enum(["development", "production"]).default("development"),
	BASE_URL: z.url().default("http://localhost:3000"),
	DATABASE_URL: z.url(),
	CORS_ORIGIN: z.string().default("*"),
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
