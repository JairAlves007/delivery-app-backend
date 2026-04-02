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
	ViewType,
	WeekDay
} from "@/generated/prisma/client.js";

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

const rawResourceArraySchema = z.array(
	z.object({
		resource: resourceResponseSchema
	})
);

const mappedResourceRecordSchema = z.record(
	z.string(),
	z
		.object({
			id: z.string(),
			path: z.string()
		})
		.optional()
);

export const resourceItemSchema = z.union([
	rawResourceArraySchema,
	mappedResourceRecordSchema
]);

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

export const addonCategoryListResponseSchema = z.object({
	addonCategories: z.array(addonCategoryResponseSchema),
	total: z.number(),
	page: z.number().optional(),
	perPage: z.number().optional(),
	totalPages: z.number().optional()
});

export const addonListResponseSchema = z.object({
	addons: z.array(addonResponseSchema),
	total: z.number(),
	page: z.number().optional(),
	perPage: z.number().optional(),
	totalPages: z.number().optional()
});

// ──────────────────────────────────────────────
// Banner
// ──────────────────────────────────────────────

export const bannerResponseSchema = z.object({
	id: z.number(),
	name: z.string(),
	link_type: z.enum(BannerLinkType),
	product_id: z.string().nullable(),
	category_id: z.string().nullable(),
	resources: resourceItemSchema
});

export const bannerListResponseSchema = z.object({
	banners: z.array(bannerResponseSchema),
	total: z.number(),
	page: z.number().optional(),
	perPage: z.number().optional(),
	totalPages: z.number().optional()
});

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

export const couponListResponseSchema = z.object({
	coupons: z.array(couponResponseSchema),
	total: z.number(),
	page: z.number().optional(),
	perPage: z.number().optional(),
	totalPages: z.number().optional()
});

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

export const districtListResponseSchema = z.object({
	districts: z.array(districtResponseSchema),
	total: z.number(),
	page: z.number().optional(),
	perPage: z.number().optional(),
	totalPages: z.number().optional()
});

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
	resources: resourceItemSchema,
	socialLinks: z.array(socialLinkSchema),
	openingHours: z.array(openingHourSchema),
	closures: z.array(closureSchema)
});

export const establishmentListResponseSchema = z.object({
	establishments: z.array(establishmentResponseSchema),
	total: z.number(),
	page: z.number().optional(),
	perPage: z.number().optional(),
	totalPages: z.number().optional()
});

// ──────────────────────────────────────────────
// Product Category
// ──────────────────────────────────────────────

export const productCategoryResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
	slug: z.string(),
	order: z.number().nullable(),
	resources: resourceItemSchema
});

export const productCategoryListResponseSchema = z.object({
	productCategories: z.array(productCategoryResponseSchema),
	total: z.number(),
	page: z.number().optional(),
	perPage: z.number().optional(),
	totalPages: z.number().optional()
});

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
	resources: resourceItemSchema
});

export const productListResponseSchema = z.object({
	products: z.array(productResponseSchema),
	total: z.number(),
	page: z.number().optional(),
	perPage: z.number().optional(),
	totalPages: z.number().optional()
});

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

export const orderListResponseSchema = z.object({
	orders: z.array(orderPayloadSchema),
	total: z.number(),
	page: z.number().optional(),
	perPage: z.number().optional(),
	totalPages: z.number().optional()
});

export const myOrdersResponseSchema = z.object({
	orders: z.array(orderPayloadSchema),
	pagination: z.object({
		nextCursor: z.string().nullable(),
		hasNextPage: z.boolean()
	})
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
	email: z.string()
});

const authEstablishmentAdminSchema = establishmentResponseSchema
	.omit({
		next_billing_date: true
	})
	.extend({
		isOpen: z.boolean()
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

const authMenuSchema = z.object({
	items: z.array(menuItemSchema).nullable(),
	forRole: z.enum(RoleType)
});

export const signInAdminResponseSchema = z.object({
	user: authUserSchema,
	establishment: authEstablishmentAdminSchema,
	menu: authMenuSchema,
	type: z.string(),
	expiresIn: z.number(),
	token: z.string()
});

export const signInCustomerResponseSchema = z.object({
	user: authUserSchema,
	establishment: authEstablishmentCustomerSchema,
	menu: authMenuSchema,
	type: z.string(),
	expiresIn: z.number(),
	token: z.string()
});

export const signUpTokenResponseSchema = z.object({
	type: z.string(),
	expiresIn: z.number(),
	token: z.string()
});

// ──────────────────────────────────────────────
// Main (Catalog)
// ──────────────────────────────────────────────

export const bannersCatalogResponseSchema = z.array(bannerResponseSchema);

export const productCategoriesCatalogResponseSchema = z.object({
	productCategories: z.array(productCategoryResponseSchema),
	pagination: z.object({
		nextCursor: z.string().nullable(),
		hasNextPage: z.boolean()
	})
});

export const productsFromCategoryCatalogResponseSchema = z.object({
	products: z.array(productResponseSchema),
	pagination: z.object({
		nextCursor: z.string().nullable(),
		hasNextPage: z.boolean()
	})
});

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

export const addressListResponseSchema = z.object({
	addresses: z.array(baseAddressSchema),
	pagination: z.object({
		nextCursor: z.string().nullable(),
		hasNextPage: z.boolean()
	})
});

// ──────────────────────────────────────────────
// Health
// ──────────────────────────────────────────────

export const healthResponseSchema = z.object({
	status: z.string()
});
