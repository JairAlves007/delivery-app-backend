export function slugify(text: string): string {
	return text
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.replace(/--+/g, "-");
}

export const removeDuplicateItems = <T extends { id: string | number }>(
	items: T[]
): T[] => {
	return [...new Map(items.map(item => [item.id, item])).values()];
};
