import {
	type ConnectionOptions,
	type DefaultJobOptions,
	Job,
	type JobsOptions,
	Queue,
	Worker
} from "bullmq";

import { env } from "@/env.js";
import { app } from "@/http/app.js";
import type { IJob, IQueueProvider } from "@/interfaces/queue/queue-base.js";

class BullMQProvider implements IQueueProvider {
	private queueName: string;
	private queue: Queue;
	private worker?: Worker;

	private connection: ConnectionOptions = {
		host: env.REDIS_HOST,
		port: env.REDIS_PORT,
		password: env.REDIS_PASSWORD,
		maxRetriesPerRequest: null
	};

	private defaultJobOptions: DefaultJobOptions = {
		attempts: 3,
		removeOnComplete: true,
		removeOnFail: { count: 30 },
		backoff: {
			type: "exponential",
			delay: 1000
		}
	};

	constructor(queueName: string) {
		this.queueName = queueName;

		this.queue = new Queue(this.queueName, {
			connection: this.connection,
			defaultJobOptions: this.defaultJobOptions
		});
	}

	async add<T = unknown>({ name, data, options }: IJob<T>): Promise<void> {
		await this.queue.add(name, data, options);
	}

	process(processFunction: (job: Job) => Promise<void>): void {
		this.worker = new Worker(this.queueName, processFunction, {
			connection: this.connection
		});

		this.worker.on("failed", (job, error) => {
			app.log.error(
				{ error },
				`[Queue] Job ${job?.id} failed with message: ${error.message}`
			);
		});

		this.worker.on("error", error => {
			app.log.error({ error }, "[Queue] Worker error:");
		});
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

	async enqueue(name: string, data: T, options?: JobsOptions): Promise<void> {
		await this.provider.add({ name, data, options });
	}

	registerProcessor(handler: (data: T) => Promise<void>): void {
		this.provider.process(async job => {
			await handler(job.data);
		});
	}
}
