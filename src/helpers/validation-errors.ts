import type { ZodError } from "zod";

export const beautifyValidationErrors = (
	error: ZodError
): Record<string, any> => {
	const result: Record<string, any> = {};

	for (const issue of error.issues) {
		const { path, message } = issue;
		if (path.length < 2) continue;

		let currentLevel = result;
		const lastIndex = path.length - 1;

		const fieldName = String(path[lastIndex]);

		const secondToLastKey = path[lastIndex - 1];
		const isErrorInArray = typeof secondToLastKey === "number";

		for (let i = 0; i < lastIndex; i++) {
			const key = path[i];
			const stringKey = String(key);
			const isArrayIndex = typeof key === "number";

			if (isArrayIndex) continue;

			if (i + 1 < lastIndex && typeof path[i + 1] === "number") {
				if (
					!currentLevel[stringKey] ||
					!Array.isArray(currentLevel[stringKey])
				) {
					currentLevel[stringKey] = [];
				}
			} else if (
				typeof currentLevel[stringKey] !== "object" ||
				currentLevel[stringKey] === null ||
				Array.isArray(currentLevel[stringKey])
			) {
				currentLevel[stringKey] = {};
			}

			currentLevel = currentLevel[stringKey];
		}

		if (isErrorInArray) {
			const arrayIndex = secondToLastKey as number;
			const arrayKey = path[lastIndex - 2] as string;

			const errorArray = currentLevel;

			if (!Array.isArray(result[arrayKey])) {
				result[arrayKey] = [];
			}

			const newErrorObject = { [fieldName]: message };

			result[arrayKey].push(newErrorObject);
		} else {
			const existingValue = currentLevel[fieldName];

			if (existingValue) {
				if (Array.isArray(existingValue)) {
					existingValue.push(message);
				} else {
					currentLevel[fieldName] = [existingValue, message];
				}
			} else {
				currentLevel[fieldName] = message;
			}
		}
	}

	return result;
};
