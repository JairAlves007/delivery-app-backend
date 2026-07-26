import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { env } from "@/env.js";

import { adminRoutes } from "./admin/index.js";
import { apiRoutes } from "./api/index.js";

const isProduction = env.NODE_ENV === "production";

export const routes = (app: FastifyInstance) => {
  app.register(
    async (api) => {
      api.register(adminRoutes);
      api.register(apiRoutes);

      if (isProduction) return;

      api.withTypeProvider<ZodTypeProvider>().route({
        method: "GET",
        url: "/swagger.json",
        schema: {
          hide: true,
        },
        handler: async () => {
          return app.swagger();
        },
      });
    },
    { prefix: "/api" },
  );
};
