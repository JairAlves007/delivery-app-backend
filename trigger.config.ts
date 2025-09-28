import { defineConfig } from "@trigger.dev/sdk/v3";

const isProduction = (process.env.NODE_ENV ?? "development") === "production";

export default defineConfig({
	project: process.env.TRIGGER_PROJECT_ID ?? "",
	runtime: "node",
	logLevel: isProduction ? "info" : "debug",
	// The max compute seconds a task is allowed to run. If the task run exceeds this duration, it will be stopped.
	// You can override this on an individual task.
	// See https://trigger.dev/docs/runs/max-duration
	maxDuration: 3600,
	retries: {
		enabledInDev: true,
		default: {
			maxAttempts: 3,
			minTimeoutInMs: 1000,
			maxTimeoutInMs: 10000,
			factor: 2,
			randomize: true
		}
	},
	dirs: ["src/tasks"]
});
