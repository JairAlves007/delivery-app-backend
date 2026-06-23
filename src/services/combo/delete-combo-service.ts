import type { IComboRepository } from "@/interfaces/repositories/combo-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";
import type { FilterField } from "@/types/crud.js";

type DeleteComboParams = {
  id: string;
} & FilterField &
  Pick<ForgetAllListingCacheKeysParams, "paramsToForget">;

export class DeleteComboService {
  private comboRepository: IComboRepository;

  constructor(comboRepository: IComboRepository) {
    this.comboRepository = comboRepository;
  }

  async handle({ id, filterParams, paramsToForget }: DeleteComboParams) {
    await this.comboRepository.delete({ id, filterParams, force: false });

    await forgetAllListingCacheKeysQueue({
      baseCacheKey: "combos",
      paramsToForget,
    });
  }
}
