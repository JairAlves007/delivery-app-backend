import { InvalidPhoneNumber } from "@/errors/whatsapp/invalid-phone-number.js";

const BRAZIL_COUNTRY_CODE = "55";

export const normalizeToBrazilianJid = (rawPhone: string): string => {
  const digits = rawPhone.replace(/\D/g, "");

  if (digits.length < 10) throw new InvalidPhoneNumber();

  if (digits.startsWith(BRAZIL_COUNTRY_CODE) && digits.length >= 12)
    return digits;

  if (digits.length === 10 || digits.length === 11)
    return `${BRAZIL_COUNTRY_CODE}${digits}`;

  return digits;
};

export const formatPhoneForDisplay = (rawPhone: string): string => {
  const digits = rawPhone.replace(/\D/g, "");

  if (digits.length === 11)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;

  if (digits.length === 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;

  return rawPhone;
};
