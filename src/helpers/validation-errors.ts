import type { ZodError } from "zod";

export const beautifyValidationErrors = (error: ZodError) => {
  const result: Record<string, unknown> = {};

  for (const issue of error.issues) {
    const path = issue.path;
    let current = result;

    path.forEach((key, index) => {
      const stringKey = String(key);

      if (index === path.length - 1) {
        const existing = current[stringKey];

        if (existing) {
          if (Array.isArray(existing)) {
            (existing as unknown[]).push(issue.message);
          } else {
            current[stringKey] = [existing, issue.message];
          }
        } else {
          current[stringKey] = issue.message;
        }
      } else {
        if (!current[stringKey]) current[stringKey] = {};

        current = current[stringKey] as Record<string, unknown>;
      }
    });
  }

  return result;
};

export function checkIfCNPJIsValid(cnpj: string): boolean {
  cnpj = cnpj.replace(/\D/g, "");

  if (cnpj.length !== 14) return false;

  if (/^(\d)\1+$/.test(cnpj)) return false;

  let size = cnpj.length - 2;
  let numbers = cnpj.substring(0, size);
  const digits = cnpj.substring(size);
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
