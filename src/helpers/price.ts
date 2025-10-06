import { DiscountType, type Coupon } from "@prisma/client";
import Constants from "./constants.ts";

export function transformPriceToDatabase(price: number): number {
	if (price < 0) throw new Error("Price cannot be negative");

	return Math.round(price * Constants.PRICE_MULTIPLIER);
}

export function transformPriceFromDatabase(price: number): number {
	return price / Constants.PRICE_MULTIPLIER;
}

export const transformValueToPercentageFromDatabase = (
	value: number
): number => {
	return value / 100;
};

export const getValueDiscounted = (
	discountType: DiscountType,
	discountValue: number,
	valueToBeDiscounted: number
): number => {
	switch (discountType) {
		case DiscountType.PERCENTAGE:
			return (
				valueToBeDiscounted *
				transformValueToPercentageFromDatabase(discountValue)
			);
		case DiscountType.FIXED:
			return transformPriceFromDatabase(discountValue);
	}
};
