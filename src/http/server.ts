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
