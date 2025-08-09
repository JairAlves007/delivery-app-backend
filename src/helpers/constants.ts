export default class Constants {
	public static readonly PRICE_MULTIPLIER: number = 100;
	public static readonly HASH_SALT_LENGTH: number = 6;
	public static readonly TOKEN_TYPE: string = "Bearer";
	public static readonly PHONE_REGEX: RegExp = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
}
