import { DiscountType } from "@/generated/prisma/client.js";

import Constants from "./constants.js";

export const transformPriceToHumanReadable = (price: number): string => {
	if (price <= 0) return "GRÁTIS";

	return price.toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL"
	});
};

export const transformPriceToDatabase = (price: number): number => {
	if (price < 0) throw new Error("Price cannot be negative");

	return Math.round(price * Constants.PRICE_MULTIPLIER);
};

export const transformPriceFromDatabase = (price: number): number => {
	return price / Constants.PRICE_MULTIPLIER;
};

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
