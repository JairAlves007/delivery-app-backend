export type ReadinessCheckName = "database" | "cache";

export type ReadinessCheckStatus = "up" | "down";

export type ReadinessStatus = "ready" | "degraded";

export type ReadinessCheck = {
  name: ReadinessCheckName;
  status: ReadinessCheckStatus;
  latencyMs: number;
  error: string | null;
};

export type CheckReadinessResult = {
  status: ReadinessStatus;
  checks: ReadinessCheck[];
};
