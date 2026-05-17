import { ProductPricingMode } from "@/generated/prisma/client.js";

export type CalculateItemPriceParams = {
  pricingMode: ProductPricingMode;
  priceCents: number;
  pricePer100gCents: number | null;
  quantity: number;
  weightGrams: number | null;
};

export const calculateItemPrice = ({
  pricingMode,
  priceCents,
  pricePer100gCents,
  quantity,
  weightGrams,
}: CalculateItemPriceParams): number => {
  if (pricingMode === ProductPricingMode.PER_WEIGHT) {
    if (pricePer100gCents == null || weightGrams == null || weightGrams <= 0) {
      return 0;
    }
    return Math.round((pricePer100gCents * weightGrams) / 100);
  }
  return priceCents * Math.max(quantity, 1);
};
