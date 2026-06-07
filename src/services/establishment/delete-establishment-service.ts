import type { IEstablishmentRepository } from "@/interfaces/repositories/establishment-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import { enqueueCleanupWhatsappInstance } from "@/queues/whatsapp-cleanup-queue.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";

type DeleteEstablishmentParams = {
  id: string;
} & Pick<ForgetAllListingCacheKeysParams, "paramsToForget">;

export class DeleteEstablishmentService {
  private establishmentRepository: IEstablishmentRepository;

  constructor(establishmentRepository: IEstablishmentRepository) {
    this.establishmentRepository = establishmentRepository;
  }

  public async handle({ id, paramsToForget }: DeleteEstablishmentParams) {
    await this.establishmentRepository.delete({
      id,
      force: false,
    });

    await forgetAllListingCacheKeysQueue({
      baseCacheKey: "establishments",
      paramsToForget,
    });

    await enqueueCleanupWhatsappInstance({ establishmentId: id });
  }
}
