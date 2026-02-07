import type { OrderSubSectionMessage } from "@/types/order.ts";

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

	// Token
	public static readonly ACCESS_TOKEN_EXPIRATION_IN_SECONDS: number =
		60 * 60 * 24 * 1;
	public static readonly ACCESS_TOKEN_EXPIRATION_TIME: string = "1d";

	// Cache
	public static readonly CACHE_KEYS = {
		products: "products",
		productCategories: "products_categories",
		establishments: "establishments",
		districts: "districts",
		coupons: "coupons",
		banners: "banners",
		addons: "addons",
		addonCategories: "addon_categories",
		users: "users",
		menus: "menus",
		addresses: "addresses",
		resourceRules: "resource_rules",
		orders: "orders"
	};

	// Order
	public static readonly ORDER_SUB_SECTIONS_MESSAGE_TEMPLATES: OrderSubSectionMessage =
		{
			address: `
				📍 Entrega em: {address_simplified}
				🗺️ Distrito: {district_name}
				{reference_point_section}
			`,
			referencePoint: "📌 Ponto de referência: {reference_point}",
			product: `
				🍔 {product_name}
				• Preço: {product_price}
				• Quantidade: {product_quantity}
				• Adicionais: {none_addons}
				{addons_section}
			`,
			addon: `
				- {addon_quantity}x {addon_name} ({addon_price})
			`,
			coupon: `🏷️ Cupom aplicado: {coupon_code} ({coupon_value})`,
			changeAmount: `💵 Troco para: {change_amount_value}`,
			comment: `📝 Observações: {comment_value}`,
			discount: `🎟️ Desconto: {discount_value}`
		};

	public static readonly ORDER_MESSAGE_TEMPLATE = `
		📦 Novo Pedido Recebido!

		🧑‍💼 Cliente: {customer_name}
		📞 Telefone: {customer_phone}
		{address}

		🛍️ Itens do Pedido:

		{order_items}

		{coupon}

		💳 Forma de pagamento: {payment_method}
		{change_amount}

		{comment}

		🚚 Tipo de entrega: {delivery_type}
		📦 Valor do frete: {shipping_cost}
		🧾 Subtotal: {subtotal}
		{discount}
		💰 Total a pagar: {total_price}

		> ⏰ Data/Hora do pedido: {order_created_at}

		> 🔗 Este pedido foi feito via sistema
	`;
}
