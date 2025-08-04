import Constants from "./constants";

export function transformPriceToDatabase(price: number): number {
	if (price < 0) throw new Error("Price cannot be negative");

	return Math.round(price * Constants.PRICE_MULTIPLIER);
}
