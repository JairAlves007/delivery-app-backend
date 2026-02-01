import { defineConfig } from "prisma/config";
import { env } from "./src/env.ts";

export default defineConfig({
	schema: "prisma/schema.prisma",
	migrations: {
		path: "prisma/migrations",
		seed: "node --loader esm-module-alias/loader --no-warnings prisma/seed.ts"
	},
	datasource: {
		url: env.DATABASE_URL
	}
});
