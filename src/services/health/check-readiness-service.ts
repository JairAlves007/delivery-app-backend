import { env } from "@/env.js";
import Constants from "@/helpers/constants.js";
import type { ICacheBase } from "@/interfaces/cache/cache-base.js";
import prisma from "@/lib/prisma.js";
import type {
  CheckReadinessResult,
  ReadinessCheck,
  ReadinessCheckName,
} from "@/types/health.js";

let memoized: { result: CheckReadinessResult; expiresAt: number } | null = null;

const withTimeout = async (
  promise: Promise<unknown>,
  timeoutMs: number,
): Promise<void> => {
  let timer: NodeJS.Timeout | undefined;

  const timeout = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(
      () => reject(new Error(`Tempo limite de ${timeoutMs}ms excedido`)),
      timeoutMs,
    );
  });

  try {
    await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timer);
  }
};

const describeError = (error: unknown): string => {
  if (env.NODE_ENV === "production") return "Dependência indisponível";

  return error instanceof Error ? error.message : "Erro desconhecido";
};

export class CheckReadinessService {
  private cache: ICacheBase;

  constructor(cache: ICacheBase) {
    this.cache = cache;
  }

  private async runCheck(
    name: ReadinessCheckName,
    check: () => Promise<unknown>,
  ): Promise<ReadinessCheck> {
    const startedAt = performance.now();

    try {
      await withTimeout(check(), Constants.HEALTH_CHECK_TIMEOUT_MS);

      return {
        name,
        status: "up",
        latencyMs: Math.round(performance.now() - startedAt),
        error: null,
      };
    } catch (error) {
      return {
        name,
        status: "down",
        latencyMs: Math.round(performance.now() - startedAt),
        error: describeError(error),
      };
    }
  }

  async handle(): Promise<CheckReadinessResult> {
    if (memoized && memoized.expiresAt > Date.now()) return memoized.result;

    const checks = await Promise.all([
      this.runCheck("database", () => prisma.$queryRaw`SELECT 1`),
      this.runCheck("cache", () => this.cache.ping()),
    ]);

    const result: CheckReadinessResult = {
      status: checks.every((check) => check.status === "up")
        ? "ready"
        : "degraded",
      checks,
    };

    memoized = {
      result,
      expiresAt: Date.now() + Constants.HEALTH_READINESS_CACHE_MS,
    };

    return result;
  }
}
