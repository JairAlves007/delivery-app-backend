import { makeWhatsappProvider } from "@/factories/integrations/make-whatsapp-provider.js";
import { makeEstablishmentWhatsappIntegrationRepository } from "@/factories/repositories/make-establishment-whatsapp-integration-repository.js";
import { makeQueue } from "@/factories/services/queue/make-queue.js";
import { whatsappCleanupQueueName } from "@/queues/whatsapp-cleanup-queue.js";
import type { CleanupWhatsappInstanceJob } from "@/types/whatsapp.js";

export const setupCleanupWhatsappInstanceWorker = () => {
  const whatsappCleanupQueue = makeQueue<CleanupWhatsappInstanceJob>(
    whatsappCleanupQueueName,
  );

  whatsappCleanupQueue.registerProcessor(async ({ establishmentId }) => {
    const integrationRepository =
      makeEstablishmentWhatsappIntegrationRepository();
    const whatsappProvider = makeWhatsappProvider();

    const integration =
      await integrationRepository.findByEstablishmentId(establishmentId);

    if (!integration) return;

    await whatsappProvider.disconnectInstance({
      instanceName: integration.instance_name,
      instanceToken: integration.instance_token,
    });

    await integrationRepository.softDeleteByEstablishmentId(establishmentId);
  });
};
