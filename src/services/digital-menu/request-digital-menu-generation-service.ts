import { DigitalMenuSource } from "@/generated/prisma/client.js";
import type { IDigitalMenuRepository } from "@/interfaces/repositories/digital-menu-repository.js";
import { enqueueGenerateDigitalMenu } from "@/queues/digital-menu-queue.js";

type RequestDigitalMenuGenerationParams = {
  establishmentId: string;
};

export class RequestDigitalMenuGenerationService {
  private digitalMenuRepository: IDigitalMenuRepository;

  constructor(digitalMenuRepository: IDigitalMenuRepository) {
    this.digitalMenuRepository = digitalMenuRepository;
  }

  async handle({
    establishmentId,
  }: RequestDigitalMenuGenerationParams): Promise<void> {
    await this.digitalMenuRepository.upsert({
      establishmentId,
      source: DigitalMenuSource.GENERATED,
    });

    await enqueueGenerateDigitalMenu({ establishmentId });
  }
}
