import type {
  CreateFailedJobParams,
  IFailedJobRepository,
} from "@/interfaces/repositories/failed-job-repository.js";
import prisma from "@/lib/prisma.js";

export class FailedJobPrismaRepository implements IFailedJobRepository {
  async create({
    queueName,
    jobId,
    payload,
    error,
  }: CreateFailedJobParams): Promise<void> {
    await prisma.failedJob.create({
      data: {
        queue_name: queueName,
        job_id: jobId ?? null,
        payload,
        error,
      },
    });
  }
}
