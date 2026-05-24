import {
	createCipheriv,
	createDecipheriv,
	createHmac,
	randomBytes,
	timingSafeEqual
} from "node:crypto";

import { env } from "@/env.js";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

const getEncryptionKey = (): Buffer => {
	return Buffer.from(env.WHATSAPP_CREDENTIALS_ENCRYPTION_KEY, "hex");
};

export const encryptSecret = (plaintext: string): string => {
	const iv = randomBytes(IV_LENGTH);
	const cipher = createCipheriv(ALGORITHM, getEncryptionKey(), iv);
	const encrypted = Buffer.concat([
		cipher.update(plaintext, "utf8"),
		cipher.final()
	]);
	const authTag = cipher.getAuthTag();

	return Buffer.concat([iv, authTag, encrypted]).toString("base64");
};

export const decryptSecret = (ciphertext: string): string => {
	const data = Buffer.from(ciphertext, "base64");
	const iv = data.subarray(0, IV_LENGTH);
	const authTag = data.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
	const encrypted = data.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

	const decipher = createDecipheriv(ALGORITHM, getEncryptionKey(), iv);
	decipher.setAuthTag(authTag);

	const decrypted = Buffer.concat([
		decipher.update(encrypted),
		decipher.final()
	]);

	return decrypted.toString("utf8");
};

export const computeHmacSha256 = (payload: string, secret: string): string => {
	return createHmac("sha256", secret).update(payload).digest("hex");
};

export const verifyHmacSha256 = (
	payload: string,
	signature: string,
	secret: string
): boolean => {
	const expected = computeHmacSha256(payload, secret);
	const expectedBuffer = Buffer.from(expected, "hex");
	const signatureBuffer = Buffer.from(signature, "hex");

	if (expectedBuffer.length !== signatureBuffer.length) return false;

	return timingSafeEqual(expectedBuffer, signatureBuffer);
};
