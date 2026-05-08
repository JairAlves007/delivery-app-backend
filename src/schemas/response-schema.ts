import { z } from "zod";

import {
	AddonType,
	BannerLinkType,
	CouponType,
	DeliveryType,
	DiscountType,
	FileFormatType,
	ForObjectResourceType,
	OrderStatusType,
	PaymentMethodType,
	ResourceType,
	RoleType,
	SocialPlatform,
	TagType,
	ViewType,
	WeekDay
} from "@/generated/prisma/client.js";

import { dashboardGranularitySchema } from "./dashboard-schema.js";
import {
	cursorPaginatedResponseSchema,
	listResponseSchema,
	paginatedResponseSchema
} from "./generic-schema.js";

// ──────────────────────────────────────────────
// Reusable primitives
// ──────────────────────────────────────────────

const dateStringSchema = z.union([z.string(), z.date()]);
const nullableDateStringSchema = dateStringSchema.nullable();

// ──────────────────────────────────────────────
// Resource
// ──────────────────────────────────────────────

export const resourceResponseSchema = z.object({
	id: z.string(),
	type: z.enum(ResourceType),
	path: z.string(),
	file_key: z.string(),
	created_at: dateStringSchema,
	updated_at: dateStringSchema
});

const mappedResourceRecordSchema = z.record(
	z.string(),
	z
		.object({
			id: z.string(),
			path: z.string(),
			fileKey: z.string()
		})
		.optional()
);

// ──────────────────────────────────────────────
// Addon
// ──────────────────────────────────────────────

export const addonResponseSchema = z.object({
	id: z.number(),
	category_id: z.number(),
	name: z.string(),
	price: z.number(),
	category: z
		.object({
			id: z.number(),
			name: z.string(),
			type: z.enum(AddonType),
			max_quantity: z.number().nullable()
		})
		.optional()
});

// ──────────────────────────────────────────────
// Addon Category
// ──────────────────────────────────────────────

export const addonCategoryResponseSchema = z.object({
	id: z.number(),
	name: z.string(),
	type: z.enum(AddonType),
	max_quantity: z.number().nullable(),
	addons: z
		.array(
			z.object({
				id: z.number(),
				name: z.string(),
				price: z.number()
			})
		)
		.optional()
});

export const addonCategoryListResponseSchema = paginatedResponseSchema(
	addonCategoryResponseSchema
);

export const addonListResponseSchema =
	paginatedResponseSchema(addonResponseSchema);

// ──────────────────────────────────────────────
// Banner
// ──────────────────────────────────────────────

export const bannerResponseSchema = z.object({
	id: z.number(),
	name: z.string(),
	link_type: z.enum(BannerLinkType),
	product_id: z.string().nullable(),
	category_id: z.string().nullable(),
	resources: mappedResourceRecordSchema
});

export const bannerListResponseSchema =
	paginatedResponseSchema(bannerResponseSchema);

// ──────────────────────────────────────────────
// Coupon
// ──────────────────────────────────────────────

export const couponResponseSchema = z.object({
	id: z.number(),
	code: z.string(),
	type: z.enum(CouponType),
	discount_type: z.enum(DiscountType),
	value: z.number(),
	starts_at: nullableDateStringSchema,
	ends_at: nullableDateStringSchema,
	max_uses: z.number().nullable(),
	uses_per_user: z.number().nullable()
});

export const couponListResponseSchema =
	paginatedResponseSchema(couponResponseSchema);

export const checkCouponResponseSchema = z.object({
	isValid: z.boolean(),
	code: z.string().nullable()
});

// ──────────────────────────────────────────────
// District
// ──────────────────────────────────────────────

export const districtResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
	shipping_cost: z.number()
});

export const districtListResponseSchema = paginatedResponseSchema(
	districtResponseSchema
);

// ──────────────────────────────────────────────
// Establishment
// ──────────────────────────────────────────────

const openingHourSchema = z.object({
	id: z.number(),
	day_of_week: z.enum(WeekDay),
	opens_at: z.string(),
	closes_at: z.string(),
	is_closed: z.boolean()
});

const socialLinkSchema = z.object({
	id: z.number(),
	platform: z.enum(SocialPlatform),
	url: z.string()
});

const closureSchema = z.object({
	id: z.number(),
	starts_at: dateStringSchema,
	ends_at: nullableDateStringSchema,
	reason: z.string().nullable()
});

const establishmentAddressSchema = z
	.object({
		id: z.string(),
		street: z.string(),
		number: z.string().nullable(),
		neighborhood: z.string(),
		city: z.string(),
		state: z.string(),
		postal_code: z.string(),
		complement: z.string().nullable(),
		reference_point: z.string().nullable(),
		phone: z.string(),
		latitude: z.number().nullable(),
		longitude: z.number().nullable()
	})
	.nullable();

export const establishmentResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
	slug: z.string(),
	description: z.string(),
	email: z.string(),
	cnpj: z.string().nullable(),
	only_delivery: z.boolean(),
	accepts_credit_card: z.boolean(),
	is_manually_closed: z.boolean(),
	next_billing_date: dateStringSchema,
	address: establishmentAddressSchema,
	resources: mappedResourceRecordSchema,
	socialLinks: z.array(socialLinkSchema),
	openingHours: z.array(openingHourSchema),
	closures: z.array(closureSchema)
});

export const establishmentListResponseSchema = paginatedResponseSchema(
	establishmentResponseSchema
);

// ──────────────────────────────────────────────
// Establishment Owner
// ──────────────────────────────────────────────

export const establishmentOwnerResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string(),
	created_at: dateStringSchema,
	establishment: z
		.object({
			id: z.string(),
			name: z.string(),
			slug: z.string()
		})
		.nullable()
});

export const establishmentOwnerListResponseSchema = paginatedResponseSchema(
	establishmentOwnerResponseSchema
);

// ──────────────────────────────────────────────
// Product Category
// ──────────────────────────────────────────────

export const productCategoryResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
	slug: z.string(),
	order: z.number().nullable(),
	resources: mappedResourceRecordSchema
});

export const productCategoryListResponseSchema = paginatedResponseSchema(
	productCategoryResponseSchema
);

// ──────────────────────────────────────────────
// Tag
// ──────────────────────────────────────────────

export const tagResponseSchema = z.object({
	id: z.number(),
	label: z.string(),
	type: z.enum(TagType)
});

export const tagDetailResponseSchema = tagResponseSchema.extend({
	combinableTags: z.array(tagResponseSchema)
});

export const tagListResponseSchema = paginatedResponseSchema(
	tagDetailResponseSchema
);

// ──────────────────────────────────────────────
// Product
// ──────────────────────────────────────────────

export const productResponseSchema = z.object({
	id: z.string(),
	category_id: z.string(),
	name: z.string(),
	description: z.string(),
	price: z.number(),
	slug: z.string(),
	discount_percentage: z.number().nullable(),
	stock: z.number().nullable(),
	valid_until: nullableDateStringSchema,
	resources: mappedResourceRecordSchema,
	tags: z.array(tagResponseSchema),
	isFavorited: z.boolean().default(false)
});

export const productListResponseSchema = paginatedResponseSchema(
	productResponseSchema
);

export const myFavoritesResponseSchema = cursorPaginatedResponseSchema(
	productResponseSchema
);

// ──────────────────────────────────────────────
// Order
// ──────────────────────────────────────────────

const orderItemAddonSchema = z.object({
	id: z.number(),
	addon_price: z.number(),
	addon_name: z.string(),
	addon_id: z.number(),
	quantity: z.number()
});

const orderItemSchema = z.object({
	id: z.number(),
	product_id: z.string(),
	product_name: z.string(),
	product_price: z.number(),
	quantity: z.number(),
	addons: z.array(orderItemAddonSchema).optional()
});

const orderCouponSchema = z.object({
	code: z.string(),
	type: z.enum(CouponType),
	discount_type: z.enum(DiscountType),
	value: z.number()
});

const orderStatusSchema = z.object({
	label: z.string(),
	value: z.enum(OrderStatusType)
});

export const orderPayloadSchema = z.object({
	id: z.string(),
	comment: z.string().nullable(),
	change_amount: z.number().nullable(),
	payment_method: z.enum(PaymentMethodType),
	delivery_type: z.enum(DeliveryType),
	shipping_fee: z.number(),
	subtotal: z.number(),
	customer_name: z.string(),
	customer_phone: z.string(),
	created_at: dateStringSchema,
	updated_at: dateStringSchema,
	items: z.array(orderItemSchema),
	coupon: orderCouponSchema.nullable(),
	status: orderStatusSchema
});

export const orderListResponseSchema =
	paginatedResponseSchema(orderPayloadSchema);

export const myOrdersResponseSchema =
	cursorPaginatedResponseSchema(orderPayloadSchema);

// ──────────────────────────────────────────────
// Dashboard
// ──────────────────────────────────────────────

const dashboardSummarySchema = z.object({
	totalOrders: z.number(),
	paidOrders: z.number(),
	cancelledOrders: z.number(),
	grossRevenue: z.number(),
	discountsTotal: z.number(),
	shippingTotal: z.number(),
	netRevenue: z.number(),
	averageOrderValue: z.number(),
	distinctCustomers: z.number()
});

const dashboardBucketSchema = z.object({
	bucket: z.string(),
	orders: z.number(),
	revenue: z.number()
});

const dashboardStatusSchema = z.object({
	status: z.enum(OrderStatusType),
	count: z.number(),
	revenue: z.number()
});

const dashboardPaymentMethodSchema = z.object({
	method: z.enum(PaymentMethodType),
	count: z.number(),
	revenue: z.number()
});

const dashboardDeliveryTypeSchema = z.object({
	type: z.enum(DeliveryType),
	count: z.number(),
	revenue: z.number()
});

const dashboardTopProductSchema = z.object({
	productId: z.string(),
	name: z.string(),
	unitsSold: z.number(),
	revenue: z.number()
});

const dashboardTopCategorySchema = z.object({
	categoryId: z.string(),
	name: z.string(),
	unitsSold: z.number(),
	revenue: z.number()
});

const dashboardTopCustomerSchema = z.object({
	userId: z.string(),
	name: z.string(),
	orders: z.number(),
	spent: z.number()
});

const dashboardTopFavoritedProductSchema = z.object({
	productId: z.string(),
	name: z.string(),
	favorites: z.number()
});

const dashboardCouponUsageSchema = z.object({
	code: z.string(),
	ordersWithCoupon: z.number(),
	discountTotal: z.number()
});

export const dashboardResponseSchema = z.object({
	currency: z.literal("BRL"),
	range: z.object({
		from: z.string(),
		to: z.string(),
		granularity: dashboardGranularitySchema,
		timezone: z.string()
	}),
	summary: dashboardSummarySchema,
	ordersOverTime: z.array(dashboardBucketSchema),
	ordersByStatus: z.array(dashboardStatusSchema),
	ordersByPaymentMethod: z.array(dashboardPaymentMethodSchema),
	ordersByDeliveryType: z.array(dashboardDeliveryTypeSchema),
	topProducts: z.array(dashboardTopProductSchema),
	topCategories: z.array(dashboardTopCategorySchema),
	topCustomers: z.array(dashboardTopCustomerSchema),
	topFavoritedProducts: z.array(dashboardTopFavoritedProductSchema),
	couponsUsage: z.array(dashboardCouponUsageSchema)
});

// ──────────────────────────────────────────────
// Upload / Resource Rules
// ──────────────────────────────────────────────

const fileFormatSchema = z.object({
	id: z.number(),
	type: z.enum(FileFormatType)
});

export const resourceRuleResponseSchema = z.object({
	id: z.number(),
	type: z.enum(ResourceType),
	width: z.number(),
	height: z.number(),
	for: z.enum(ForObjectResourceType),
	availableFormats: z.array(fileFormatSchema)
});

export const signedUrlResponseSchema = z.object({
	signedUrl: z.string(),
	fileKey: z.string()
});

// ──────────────────────────────────────────────
// Auth
// ──────────────────────────────────────────────

const menuItemSchema = z.object({
	label: z.string(),
	slug: z.string(),
	order: z.number(),
	view_type: z.enum(ViewType).nullable(),
	submenus: z.array(
		z.object({
			label: z.string(),
			slug: z.string(),
			order: z.number(),
			view_type: z.enum(ViewType)
		})
	)
});

const authUserSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string(),
	role: z.enum(RoleType)
});

const authEstablishmentCustomerSchema = establishmentResponseSchema
	.omit({
		cnpj: true,
		email: true,
		next_billing_date: true
	})
	.extend({
		isOpen: z.boolean()
	});

const authMenuSchema = z.array(menuItemSchema).nullable();

export const signInCustomerResponseSchema = z.object({
	type: z.string(),
	expiresIn: z.number(),
	token: z.string(),
	refreshToken: z.string(),
	refreshTokenExpiresIn: z.number()
});

export const signInAdminResponseSchema = z.object({
	type: z.string(),
	expiresIn: z.number(),
	token: z.string(),
	refreshToken: z.string(),
	refreshTokenExpiresIn: z.number()
});

export const signUpTokenResponseSchema = z.object({
	type: z.string(),
	expiresIn: z.number(),
	token: z.string(),
	refreshToken: z.string(),
	refreshTokenExpiresIn: z.number()
});

export const refreshTokenResponseSchema = z.object({
	type: z.string(),
	expiresIn: z.number(),
	token: z.string(),
	refreshToken: z.string(),
	refreshTokenExpiresIn: z.number()
});

export const meResponseSchema = z.object({
	user: authUserSchema,
	establishment: authEstablishmentCustomerSchema,
	menu: authMenuSchema
});

// ──────────────────────────────────────────────
// Main (Catalog)
// ──────────────────────────────────────────────

export const bannersCatalogResponseSchema =
	listResponseSchema(bannerResponseSchema);

export const productCategoriesCatalogResponseSchema =
	cursorPaginatedResponseSchema(productCategoryResponseSchema);

export const productsFromCategoryCatalogResponseSchema =
	cursorPaginatedResponseSchema(productResponseSchema);

export const suggestedProductsCatalogResponseSchema = listResponseSchema(
	productResponseSchema
);

// ──────────────────────────────────────────────
// Address
// ──────────────────────────────────────────────

const baseAddressSchema = z.object({
	id: z.string(),
	street: z.string(),
	number: z.string().nullable(),
	neighborhood: z.string(),
	city: z.string(),
	state: z.string(),
	postal_code: z.string(),
	complement: z.string().nullable(),
	reference_point: z.string().nullable(),
	phone: z.string(),
	latitude: z.number().nullable(),
	longitude: z.number().nullable()
});

export const addressResponseSchema = baseAddressSchema.extend({
	address_id: z.string(),
	is_default: z.boolean()
});

export const addressListResponseSchema =
	cursorPaginatedResponseSchema(baseAddressSchema);

// ──────────────────────────────────────────────
// Health
// ──────────────────────────────────────────────

export const healthResponseSchema = z.object({
	status: z.string()
});

const registryItems = [
	{ schema: resourceResponseSchema, id: "ResourceResponse" },
	{ schema: mappedResourceRecordSchema, id: "ResourceItem" },
	{ schema: addonResponseSchema, id: "AddonResponse" },
	{ schema: addonCategoryResponseSchema, id: "AddonCategoryResponse" },
	{ schema: addonCategoryListResponseSchema, id: "AddonCategoryListResponse" },
	{ schema: addonListResponseSchema, id: "AddonListResponse" },
	{ schema: bannerResponseSchema, id: "BannerResponse" },
	{ schema: bannerListResponseSchema, id: "BannerListResponse" },
	{ schema: couponResponseSchema, id: "CouponResponse" },
	{ schema: couponListResponseSchema, id: "CouponListResponse" },
	{ schema: checkCouponResponseSchema, id: "CheckCouponResponse" },
	{ schema: districtResponseSchema, id: "DistrictResponse" },
	{ schema: districtListResponseSchema, id: "DistrictListResponse" },
	{ schema: establishmentResponseSchema, id: "EstablishmentResponse" },
	{ schema: establishmentListResponseSchema, id: "EstablishmentListResponse" },
	{
		schema: establishmentOwnerResponseSchema,
		id: "EstablishmentOwnerResponse"
	},
	{
		schema: establishmentOwnerListResponseSchema,
		id: "EstablishmentOwnerListResponse"
	},
	{ schema: productCategoryResponseSchema, id: "ProductCategoryResponse" },
	{
		schema: productCategoryListResponseSchema,
		id: "ProductCategoryListResponse"
	},
	{ schema: productResponseSchema, id: "ProductResponse" },
	{ schema: productListResponseSchema, id: "ProductListResponse" },
	{ schema: myFavoritesResponseSchema, id: "MyFavoritesResponse" },
	{ schema: tagResponseSchema, id: "TagResponse" },
	{ schema: tagDetailResponseSchema, id: "TagDetailResponse" },
	{ schema: tagListResponseSchema, id: "TagListResponse" },
	{ schema: z.enum(TagType), id: "TagType" },
	{ schema: orderPayloadSchema, id: "OrderPayload" },
	{ schema: orderListResponseSchema, id: "OrderListResponse" },
	{ schema: myOrdersResponseSchema, id: "MyOrdersResponse" },
	{ schema: dashboardResponseSchema, id: "DashboardResponse" },
	{ schema: resourceRuleResponseSchema, id: "ResourceRuleResponse" },
	{ schema: signedUrlResponseSchema, id: "SignedUrlResponse" },
	{ schema: signInAdminResponseSchema, id: "SignInAdminResponse" },
	{ schema: signInCustomerResponseSchema, id: "SignInCustomerResponse" },
	{ schema: signUpTokenResponseSchema, id: "SignUpTokenResponse" },
	{ schema: refreshTokenResponseSchema, id: "RefreshTokenResponse" },
	{ schema: meResponseSchema, id: "MeResponse" },
	{ schema: bannersCatalogResponseSchema, id: "BannersCatalogResponse" },
	{
		schema: productCategoriesCatalogResponseSchema,
		id: "ProductCategoriesCatalogResponse"
	},
	{
		schema: productsFromCategoryCatalogResponseSchema,
		id: "ProductsFromCategoryCatalogResponse"
	},
	{
		schema: suggestedProductsCatalogResponseSchema,
		id: "SuggestedProductsCatalogResponse"
	},
	{ schema: addressResponseSchema, id: "AddressResponse" },
	{ schema: addressListResponseSchema, id: "AddressListResponse" },
	{ schema: healthResponseSchema, id: "HealthResponse" },
	{
		schema: z.enum(AddonType),
		id: "AddonType"
	},
	{
		schema: z.enum(BannerLinkType),
		id: "BannerLinkType"
	},
	{
		schema: z.enum(CouponType),
		id: "CouponType"
	},
	{
		schema: z.enum(DeliveryType),
		id: "DeliveryType"
	},
	{
		schema: z.enum(DiscountType),
		id: "DiscountType"
	},
	{
		schema: z.enum(FileFormatType),
		id: "FileFormatType"
	},
	{
		schema: z.enum(ForObjectResourceType),
		id: "ForObjectResourceType"
	},
	{
		schema: z.enum(OrderStatusType),
		id: "OrderStatusType"
	},
	{
		schema: z.enum(PaymentMethodType),
		id: "PaymentMethodType"
	},
	{
		schema: z.enum(ResourceType),
		id: "ResourceType"
	},
	{
		schema: z.enum(RoleType),
		id: "RoleType"
	},
	{
		schema: z.enum(SocialPlatform),
		id: "SocialPlatform"
	},
	{
		schema: z.enum(ViewType),
		id: "ViewType"
	},
	{
		schema: z.enum(WeekDay),
		id: "WeekDay"
	}
];

for (const { schema, id } of registryItems) {
	z.globalRegistry.add(schema, { id });
}
