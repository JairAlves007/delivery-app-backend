import {
  type ConnectionOptions,
  type DefaultJobOptions,
  Job,
  type JobsOptions,
  Queue,
  Worker,
} from "bullmq";

import { env } from "@/env.js";
import { app } from "@/http/app.js";
import type {
  IFinalFailure,
  IJob,
  IProcessorOptions,
  IQueueProvider,
  IRepeatableJob,
} from "@/interfaces/queue/queue-base.js";

class BullMQProvider implements IQueueProvider {
  private queueName: string;
  private queue: Queue;
  private worker?: Worker;

  private connection: ConnectionOptions = {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD,
    maxRetriesPerRequest: null,
  };

  private defaultJobOptions: DefaultJobOptions = {
    attempts: 3,
    removeOnComplete: true,
    removeOnFail: { count: 30 },
    backoff: {
      type: "exponential",
      delay: 1000,
    },
  };

  constructor(queueName: string) {
    this.queueName = queueName;

    this.queue = new Queue(this.queueName, {
      connection: this.connection,
      defaultJobOptions: this.defaultJobOptions,
    });
  }

  async add<T = unknown>({ name, data, options }: IJob<T>): Promise<void> {
    await this.queue.add(name, data, options);
  }

  async scheduleRepeatable<T = unknown>({
    schedulerId,
    pattern,
    tz,
    job,
  }: IRepeatableJob<T>): Promise<void> {
    await this.queue.upsertJobScheduler(
      schedulerId,
      { pattern, tz },
      { name: job.name, data: job.data, opts: job.options },
    );
  }

  process(
    processFunction: (job: Job) => Promise<void>,
    options?: IProcessorOptions,
  ): void {
    this.worker = new Worker(this.queueName, processFunction, {
      connection: this.connection,
      ...(options?.concurrency ? { concurrency: options.concurrency } : {}),
    });

    this.worker.on("failed", async (job, error) => {
      app.log.error(
        { error },
        `[Queue] Job ${job?.id} failed with message: ${error.message}`,
      );

      if (!job || !options?.onFinalFailure) return;

      const maxAttempts = job.opts.attempts ?? 1;

      if (job.attemptsMade < maxAttempts) return;

      try {
        await options.onFinalFailure({
          jobId: job.id,
          data: job.data,
          error,
        });
      } catch (handlerError) {
        app.log.error(
          { error: handlerError },
          `[Queue] onFinalFailure handler failed for job ${job.id}`,
        );
      }
    });

    this.worker.on("stalled", (jobId) => {
      app.log.warn(`[Queue] Job ${jobId} stalled on queue ${this.queueName}`);
    });

    this.worker.on("error", (error) => {
      app.log.error({ error }, "[Queue] Worker error:");
    });
  }

  async close(): Promise<void> {
    await this.worker?.close();
    await this.queue.close();
  }
}

export class BaseQueue<T = unknown> {
  private static instances: Map<string, BaseQueue<unknown>> = new Map();
  private provider: IQueueProvider;

  private constructor(queueName: string) {
    this.provider = new BullMQProvider(queueName);
  }

  public static getInstance<T>(queueName: string): BaseQueue<T> {
    if (!this.instances.has(queueName)) {
      this.instances.set(queueName, new BaseQueue<T>(queueName));
    }
    return this.instances.get(queueName) as BaseQueue<T>;
  }

  public static async closeAll(): Promise<void> {
    await Promise.all(
      [...this.instances.values()].map((instance) => instance.provider.close()),
    );
  }

  async enqueue(name: string, data: T, options?: JobsOptions): Promise<void> {
    await this.provider.add({ name, data, options });
  }

  async scheduleRepeatable({
    schedulerId,
    pattern,
    tz,
    job,
  }: IRepeatableJob<T>): Promise<void> {
    await this.provider.scheduleRepeatable({ schedulerId, pattern, tz, job });
  }

  registerProcessor(
    handler: (data: T) => Promise<void>,
    options?: {
      concurrency?: number;
      onFinalFailure?: (failure: IFinalFailure<T>) => Promise<void> | void;
    },
  ): void {
    this.provider.process(async (job) => {
      await handler(job.data);
    }, options as IProcessorOptions);
  }
}
