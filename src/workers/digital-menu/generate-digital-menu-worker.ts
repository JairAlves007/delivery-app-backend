import { makeDigitalMenuRepository } from "@/factories/repositories/make-digital-menu-repository.js";
import { makeGenerateDigitalMenuService } from "@/factories/services/digital-menu/make-generate-digital-menu-service.js";
import { makeQueue } from "@/factories/services/queue/make-queue.js";
import { app } from "@/http/app.js";
import { closeBrowser } from "@/lib/puppeteer.js";
import { digitalMenuQueueName } from "@/queues/digital-menu-queue.js";
import type { GenerateDigitalMenuJob } from "@/types/digital-menu.js";

export const setupGenerateDigitalMenuWorker = () => {
  const digitalMenuQueue = makeQueue<GenerateDigitalMenuJob>(
    digitalMenuQueueName,
  );

  digitalMenuQueue.registerProcessor(async (payload) => {
    const generateDigitalMenuService = makeGenerateDigitalMenuService();

    try {
      await generateDigitalMenuService.handle(payload);
    } catch (error) {
      app.log.error(
        { error, establishmentId: payload.establishmentId },
        "[DigitalMenu] failed to generate menu PDF",
      );

      const digitalMenuRepository = makeDigitalMenuRepository();
      await digitalMenuRepository.markFailed(payload.establishmentId);

      throw error;
    }
  });

  app.addHook("onClose", async () => {
    await closeBrowser();
  });
};
