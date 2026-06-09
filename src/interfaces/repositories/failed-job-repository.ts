import type { Prisma } from "@/generated/prisma/client.js";

export type CreateFailedJobParams = {
  queueName: string;
  jobId?: string | null;
  payload: Prisma.InputJsonValue;
  error: string;
};

export interface IFailedJobRepository {
  create(params: CreateFailedJobParams): Promise<void>;
}
