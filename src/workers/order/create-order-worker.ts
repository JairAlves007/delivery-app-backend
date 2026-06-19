import { makeFailedJobRepository } from "@/factories/repositories/make-failed-job-repository.js";
import { makeCreateOrderService } from "@/factories/services/order/make-create-order-service.js";
import { makeQueue } from "@/factories/services/queue/make-queue.js";
import { NotificationType, type Prisma } from "@/generated/prisma/client.js";
import { createNotificationQueue } from "@/queues/notification-queue.js";
import { orderQueueName } from "@/queues/order-queue.js";
import type { CreateOrderPlan } from "@/types/order.js";

export const setupCreateOrderWorker = () => {
  const orderQueue = makeQueue<CreateOrderPlan>(orderQueueName);

  orderQueue.registerProcessor(
    async (plan) => {
      const createOrderService = makeCreateOrderService();
      await createOrderService.persist(plan);
    },
    {
      concurrency: 5,
      onFinalFailure: async ({ jobId, data, error }) => {
        const failedJobRepository = makeFailedJobRepository();

        await failedJobRepository.create({
          queueName: orderQueueName,
          jobId,
          payload: data as unknown as Prisma.InputJsonValue,
          error: error.message,
        });

        await createNotificationQueue({
          establishmentId: data.establishmentId,
          type: NotificationType.ORDER_FAILED,
          title: "Falha ao processar pedido",
          description: `Não foi possível processar o pedido de ${data.customerName}`,
          metadata: {
            jobId: jobId ?? null,
            customerName: data.customerName,
            customerPhone: data.customerPhone,
          },
        });
      },
    },
  );
};
