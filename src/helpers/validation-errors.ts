import type { ZodError } from "zod";

export const beautifyValidationErrors = (error: ZodError) => {
	const result: Record<string, any> = {};

	for (const issue of error.issues) {
		const path = issue.path;
		let current = result;

		path.forEach((key, index) => {
			const stringKey = String(key);

			if (index === path.length - 1) {
				if (current[stringKey]) {
					if (Array.isArray(current[stringKey])) {
						current[stringKey].push(issue.message);
					} else {
						current[stringKey] = [current[stringKey], issue.message];
					}
				} else {
					current[stringKey] = issue.message;
				}
			} else {
				if (!current[stringKey]) current[stringKey] = {};

				current = current[stringKey];
			}
		});
	}

	return result;
};
