import type { NotificationType } from "@/generated/prisma/client.js";
import type { OrderSubSectionMessage } from "@/types/order.js";

export default class Constants {
	// Hash
	public static readonly HASH_SALT_LENGTH: number = 6;

	// Strings
	public static readonly TOKEN_TYPE: string = "Bearer";
	public static readonly PUBLIC_API_KEY_HEADER: string = "x-api-key";

	// Numbers
	public static readonly PRICE_MULTIPLIER: number = 100;
	public static readonly SIGNED_URL_EXPIRES_IN_MINUTES: number = 60 * 4;
	public static readonly PASSWORD_RESET_TOKEN_EXPIRES_IN_SECONDS: number =
		60 * 60;
	public static readonly MAX_LISTING_LIMIT: number = 200;
	public static readonly DASHBOARD_TOP_N: number = 10;
	public static readonly DASHBOARD_TIMEZONE: string = "America/Fortaleza";
	public static readonly DIGITAL_MENU_STORAGE_DIR: string = "storage/menus";
	public static readonly DIGITAL_MENU_MAX_UPLOAD_BYTES: number =
		10 * 1024 * 1024;
	public static readonly DIGITAL_MENU_MIME_TYPE: string = "application/pdf";
	public static readonly DASHBOARD_EXPORT_MIME_TYPES = {
		xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		csv: "text/csv; charset=utf-8"
	} as const;

	// Notifications
	public static readonly NOTIFICATION_DEFAULTS: Record<
		NotificationType,
		{ expiresInDays: number }
	> = {
		ORDER_CREATED: { expiresInDays: 3 },
		ORDER_FAILED: { expiresInDays: 7 },
		LOW_STOCK: { expiresInDays: 7 },
		BILLING_DUE: { expiresInDays: 3 }
	};

	public static readonly NOTIFICATION_CLEANUP_CRON: string = "0 3 * * *";
	public static readonly NOTIFICATION_CLEANUP_SCHEDULER_ID: string =
		"cleanup-expired-notifications";
	public static readonly BILLING_DUE_CRON: string = "0 14 * * *";
	public static readonly BILLING_DUE_SCHEDULER_ID: string =
		"check-billing-due";
	public static readonly BILLING_DUE_DAYS_BEFORE: number = 3;
	public static readonly BILLING_GRACE_PERIOD_DAYS: number = 3;
	public static readonly NOTIFICATION_CHANNEL_PREFIX: string =
		"notifications:establishment:";
	public static readonly SSE_TICKET_PREFIX: string = "sse-ticket:";
	public static readonly SSE_TICKET_TTL_SECONDS: number = 60;
	public static readonly SSE_HEARTBEAT_MS: number = 25_000;

	// Regex
	public static readonly PHONE_REGEX: RegExp = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
	public static readonly POSTAL_CODE_REGEX: RegExp = /^\d{5}-?\d{3}$/;
	public static readonly MIME_TYPE_REGEX: RegExp = /\w+\/[-+.\w]+/;

	// Token
	public static readonly ACCESS_TOKEN_EXPIRATION_IN_SECONDS: number =
		60 * 60 * 1;
	public static readonly ACCESS_TOKEN_EXPIRATION_TIME: string = "1h";
	public static readonly REFRESH_TOKEN_EXPIRATION_IN_SECONDS: number =
		60 * 60 * 24 * 7;
	public static readonly REFRESH_TOKEN_EXPIRATION_TIME: string = "7d";

	// Cache
	public static readonly CACHE_TAG_SET_TTL_SECONDS: number = 60 * 60 * 24;

	public static readonly CACHE_KEYS = {
		products: "products",
		productCategories: "products_categories",
		tags: "tags",
		establishments: "establishments",
		districts: "districts",
		coupons: "coupons",
		banners: "banners",
		addons: "addons",
		addonCategories: "addon_categories",
		productAddonCategories: "product_addon_categories",
		users: "users",
		menus: "menus",
		addresses: "addresses",
		resourceRules: "resource_rules",
		orders: "orders",
		dashboard: "dashboard",
		favorites: "favorites",
		establishmentTheme: "establishment_theme",
		digitalMenu: "digital_menu",
		whatsappNumberCheck: "whatsapp_number_check"
	};

	public static readonly THEME_SCHEMA_VERSION: string = "1";

	public static readonly DEFAULT_ESTABLISHMENT_THEME = {
		colors: {
			primary: "#FA8C00",
			secondary: "#FFF6EC",
			destructive: "#C2526E",
			background: "#FFFFFF",
			foreground: "#1C1C1C",
			muted: "#E0E0E0",
			border: "#FA8C00"
		},
		colorsDark: {
			primary: "#FA8C00",
			secondary: "#2E2A27",
			destructive: "#BA5269",
			background: "#211E1B",
			foreground: "#F4EFEB",
			muted: "#36312E",
			border: "#3A3431"
		}
	} as const;

	/** Cache TTL em segundos, por domínio */
	public static readonly CACHE_TTL = {
		/** Dashboard agregado — 1 min (leituras frequentes, freshness moderada) */
		dashboard: 60,
		/** Pedidos mudam de status frequentemente — 2 min */
		orders: 60 * 2,
		/** Favoritos do usuário — 5 min */
		favorites: 60 * 5,
		/** Cupons podem expirar ou atingir limite de uso — 5 min */
		coupons: 60 * 5,
		/** Dados de usuário mudam moderadamente — 10 min */
		users: 60 * 10,
		/** Endereços pessoais — 15 min */
		addresses: 60 * 15,
		/** Produtos (preço/estoque) — 15 min */
		products: 60 * 15,
		/** Categorias de produto — 30 min */
		productCategories: 60 * 30,
		/** Banners de marketing — 30 min */
		banners: 60 * 30,
		/** Adicionais — 30 min */
		addons: 60 * 30,
		/** Categorias de adicionais — 30 min */
		addonCategories: 60 * 30,
		/** Dados de estabelecimento — 1 h */
		establishments: 60 * 60,
		/** Tema do estabelecimento — 1 h */
		establishmentTheme: 60 * 60,
		/** Cardápio digital — 1 h */
		digitalMenu: 60 * 60,
		/** Distritos/áreas de entrega — 1 h */
		districts: 60 * 60,
		/** Menus estruturais — 12 h */
		menus: 60 * 60 * 12,
		/** Regras de upload (schema) — 24 h */
		resourceRules: 60 * 60 * 24,
		/** Número possui WhatsApp — estável, 6 h */
		whatsappNumberCheck: 60 * 60 * 6
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
			productUnit: `
				🍔 {product_name}
				• {product_price} × {product_quantity} = {product_subtotal}
				• Adicionais: {none_addons}
				{addons_section}
				• Total do item: {item_total}
			`,
			productWeighted: `
				🍔 {product_name}
				• {price_per_100g} × {weight_grams_human} = {product_subtotal}
				• Adicionais: {none_addons}
				{addons_section}
				• Total do item: {item_total}
			`,
			addon: `
				- {addon_quantity}x {addon_name} ({addon_price})
			`,
			addonCategoryBlock: `
				▸ {category_name} {category_strategy_label}
				{category_addons_list}
				• Subtotal da categoria: {category_subtotal}
			`,
			addonItemQuantity:
				"    - {addon_name} ({addon_unit_price} × {addon_quantity})",
			addonItemMultiple: "    - {addon_name} ({addon_price})",
			addonItemSingle: "    - {addon_name}",
			addonItemFractional:
				"    - {fraction_label} {addon_name} ({addon_price})",
			addonItemNone: "    - {addon_name}",
			coupon: `🏷️ Cupom aplicado: {coupon_code} ({coupon_value})`,
			changeAmount: `💵 Troco para: {change_amount_value}`,
			comment: `📝 Observações: {comment_value}`,
			discountOrder: `🎟️ Desconto no pedido: - {discount_value}`,
			discountShipping: `🎟️ Desconto no frete: - {discount_value}`
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
		🧾 Subtotal dos itens: {subtotal}
		📦 Frete: {shipping_cost}
		{discount}
		💰 Total a pagar: {total_price}

		> ⏰ Data/Hora do pedido: {order_created_at}

		> 🔗 Este pedido foi feito via sistema
	`;
}
