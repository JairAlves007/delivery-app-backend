import { type FileMimeType, fileMimeTypeValues } from "@/types/resource.ts";
import { FileFormatType } from "@prisma/client";

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

export function checkIfCNPJIsValid(cnpj: string): boolean {
	cnpj = cnpj.replace(/\D/g, "");

	if (cnpj.length !== 14) return false;

	if (/^(\d)\1+$/.test(cnpj)) return false;

	let size = cnpj.length - 2;
	let numbers = cnpj.substring(0, size);
	let digits = cnpj.substring(size);
	let sum = 0;
	let position = size - 7;

	for (let i = size; i >= 1; i--) {
		sum += parseInt(numbers.charAt(size - i), 10) * position--;
		if (position < 2) position = 9;
	}

	let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
	if (result !== parseInt(digits.charAt(0), 10)) return false;

	size++;
	numbers = cnpj.substring(0, size);
	sum = 0;
	position = size - 7;

	for (let i = size; i >= 1; i--) {
		sum += parseInt(numbers.charAt(size - i), 10) * position--;
		if (position < 2) position = 9;
	}
	result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
	return result === parseInt(digits.charAt(1), 10);
}

export const transformValueToPercentage = (value: number): number => {
	return value / 100;
};
