import { env } from "@/env.js";

import { app } from "./app.js";

app
  .listen({
    port: env.PORT,
    host: "0.0.0.0",
  })
  .then(() => {
    console.log(`🚀 Server is running on ${env.BASE_URL}`);
  })
  .catch((err) => {
    console.error("Error starting server:", err);
    process.exit(1);
  });

const shutdown = async (signal: string) => {
  app.log.info(`Received ${signal}, shutting down gracefully...`);

  try {
    await app.close();
    process.exit(0);
  } catch (error) {
    app.log.error({ error }, "Error during graceful shutdown");
    process.exit(1);
  }
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
