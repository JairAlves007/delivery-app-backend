export default class Constants {
	// Hash
	public static readonly HASH_SALT_LENGTH: number = 6;

	// Strings
	public static readonly TOKEN_TYPE: string = "Bearer";

	// Numbers
	public static readonly PRICE_MULTIPLIER: number = 100;
	public static readonly SIGNED_URL_EXPIRES_IN_MINUTES: number = 60 * 4;
	public static readonly PASSWORD_RESET_TOKEN_EXPIRES_IN_SECONDS: number =
		60 * 60;

	// Regex
	public static readonly PHONE_REGEX: RegExp = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
	public static readonly POSTAL_CODE_REGEX: RegExp = /^\d{5}-?\d{3}$/;
	public static readonly MIME_TYPE_REGEX: RegExp = /\w+\/[-+.\w]+/;
}
