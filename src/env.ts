import z from "zod";

const envSchema = z.object({
	PORT: z.string().default("3000"),
	NODE_ENV: z.enum(["development", "production"]).default("development"),
	BASE_URL: z.url().default("http://localhost:3000"),
	DATABASE_URL: z.url(),
	CORS_ORIGIN: z.string().default("*")
});

export const env = envSchema.parse(process.env);
