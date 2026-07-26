import {
  AddonPricingStrategy,
  AddonType,
} from "@/generated/prisma/client.js";

type AddonPricingInput = {
  priceCents: number;
  quantity: number;
};

export type CalculateAddonPricingParams = {
  pricingStrategy: AddonPricingStrategy;
  type: AddonType;
  partsCount: number | null;
  addons: AddonPricingInput[];
};

export const calculateAddonPricing = ({
  pricingStrategy,
  type,
  partsCount,
  addons,
}: CalculateAddonPricingParams): number => {
  if (!addons || addons.length === 0) return 0;

  switch (pricingStrategy) {
    case AddonPricingStrategy.NONE:
      return 0;

    case AddonPricingStrategy.SUM:
      return addons.reduce((acc, a) => acc + a.priceCents * a.quantity, 0);

    case AddonPricingStrategy.MAX:
      return Math.max(...addons.map((a) => a.priceCents));

    case AddonPricingStrategy.AVERAGE: {
      if (
        type === AddonType.FRACTIONAL &&
        partsCount != null &&
        partsCount > 0
      ) {
        const totalWeighted = addons.reduce(
          (acc, a) => acc + a.priceCents * a.quantity,
          0,
        );
        return Math.round(totalWeighted / partsCount);
      }
      const sum = addons.reduce((acc, a) => acc + a.priceCents, 0);
      return Math.round(sum / addons.length);
    }

    default:
      return 0;
  }
};
