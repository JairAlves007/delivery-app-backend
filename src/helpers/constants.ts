export default class Constants {
	// Strings
	public static readonly TOKEN_TYPE: string = "Bearer";

	// Numbers
	public static readonly PRICE_MULTIPLIER: number = 100;
	public static readonly HASH_SALT_LENGTH: number = 6;
	public static readonly SIGNED_URL_EXPIRES_IN_MINUTES: number = 60 * 4;

	// Regex
	public static readonly PHONE_REGEX: RegExp = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
	public static readonly MIME_TYPE_REGEX: RegExp = /\w+\/[-+.\w]+/;
}
