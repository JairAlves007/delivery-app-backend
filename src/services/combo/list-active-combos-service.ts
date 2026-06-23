import { makeCache } from "@/factories/services/cache/make-cache.js";
import Constants from "@/helpers/constants.js";
import { transformPriceFromDatabase } from "@/helpers/price.js";
import type { IComboRepository } from "@/interfaces/repositories/combo-repository.js";
import { mapCombo } from "@/services/combo/map-combo.js";
import type { EstablishmentID } from "@/types/establishment.js";

type ListActiveCombosServiceRequest = {
  establishmentId: EstablishmentID;
};

export class ListActiveCombosService {
  private comboRepository: IComboRepository;

  constructor(comboRepository: IComboRepository) {
    this.comboRepository = comboRepository;
  }

  async handle({ establishmentId }: ListActiveCombosServiceRequest) {
    const cache = makeCache();
    const key = `${cache.keys.combos}_active_${establishmentId}`;

    const combos = await cache.remember(
      key,
      Constants.CACHE_TTL.combos,
      async () =>
        await this.comboRepository.findActiveByEstablishment(establishmentId),
      { domain: "combos", establishmentId },
    );

    return combos.map((combo) => mapCombo(combo, transformPriceFromDatabase));
  }
}
