import { ComboInvalidSelection } from "@/errors/combo/invalid-selection.js";
import { ComboNotFound } from "@/errors/combo/not-found.js";
import { ComboUnavailable } from "@/errors/combo/unavailable.js";
import { ComboType } from "@/generated/prisma/client.js";
import type { IComboRepository } from "@/interfaces/repositories/combo-repository.js";
import type {
  ComboForOrder,
  ComboOrderInput,
  ComboToProcess,
} from "@/types/combo.js";
import type { EstablishmentID } from "@/types/establishment.js";

type ValidateCombosFromOrderServiceRequest = {
  establishmentId: EstablishmentID;
  combos: ComboOrderInput[];
};

export class ValidateCombosFromOrderService {
  private comboRepository: IComboRepository;

  constructor(comboRepository: IComboRepository) {
    this.comboRepository = comboRepository;
  }

  private buildFixed(combo: ComboForOrder, input: ComboOrderInput): ComboToProcess {
    return {
      comboId: combo.id,
      comboName: combo.name,
      comboPriceCents: combo.price,
      quantity: input.quantity,
      selections: combo.items.map((item) => ({
        productId: item.product_id,
        productName: item.product.name,
        quantity: item.quantity,
        additionalPriceCents: 0,
      })),
    };
  }

  private buildByOwn(combo: ComboForOrder, input: ComboOrderInput): ComboToProcess {
    const optionByProduct = new Map<
      string,
      { groupId: string; additionalPrice: number; productName: string }
    >();

    for (const group of combo.groups) {
      for (const option of group.options) {
        if (!optionByProduct.has(option.product_id)) {
          optionByProduct.set(option.product_id, {
            groupId: group.id,
            additionalPrice: option.additional_price,
            productName: option.product.name,
          });
        }
      }
    }

    const selectionsPerGroup = new Map<string, number>();
    let additionalCents = 0;

    const selections = input.selections.map((selection) => {
      const option = optionByProduct.get(selection.productId);
      if (!option) throw new ComboInvalidSelection();

      selectionsPerGroup.set(
        option.groupId,
        (selectionsPerGroup.get(option.groupId) ?? 0) + 1,
      );
      additionalCents += option.additionalPrice;

      return {
        productId: selection.productId,
        productName: option.productName,
        quantity: 1,
        additionalPriceCents: option.additionalPrice,
      };
    });

    for (const group of combo.groups) {
      const count = selectionsPerGroup.get(group.id) ?? 0;
      if (count < group.min_selection || count > group.max_selection)
        throw new ComboInvalidSelection(
          `Seleção inválida para o grupo "${group.name}"`,
        );
    }

    return {
      comboId: combo.id,
      comboName: combo.name,
      comboPriceCents: combo.price + additionalCents,
      quantity: input.quantity,
      selections,
    };
  }

  async handle({
    establishmentId,
    combos,
  }: ValidateCombosFromOrderServiceRequest): Promise<ComboToProcess[]> {
    const now = new Date();

    return await Promise.all(
      combos.map(async (input) => {
        const combo = await this.comboRepository.findByIdForOrder(
          input.comboId,
          establishmentId,
        );

        if (!combo) throw new ComboNotFound();

        if (!combo.is_active || (combo.valid_until && combo.valid_until < now))
          throw new ComboUnavailable();

        return combo.combo_type === ComboType.FIXED
          ? this.buildFixed(combo, input)
          : this.buildByOwn(combo, input);
      }),
    );
  }
}
