import { z } from "zod";

declare module "zod" {
	interface ZodString {
		enumCaseInsensitive<T extends Record<string, string | number>>(
			enumObj: T,
			message?: string
		): ZodEffects<ZodString, T[keyof T], string>;
	}
}

z.ZodString.prototype.enumCaseInsensitive = function <
	T extends Record<string, string | number>
>(enumObj: T, message = "Valor inválido") {
	return this.transform(val => val.toUpperCase() as T[keyof T]).refine(
		val => Object.values(enumObj).includes(val),
		{ message }
	);
};
