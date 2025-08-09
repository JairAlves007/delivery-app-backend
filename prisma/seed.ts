import Constants from "@/helpers/constants";
import { transformPriceToDatabase } from "@/helpers/price";
import { slugify } from "@/helpers/utils";
import {
	PrismaClient,
	PermissionType,
	RoleType,
	ProductCategory,
	Product,
	AddonCategory,
	AddonType,
	CouponType,
	DiscountType,
	BannerLinkType,
	SocialPlatform,
	WeekDay
} from "@prisma/client";
import { hash } from "bcrypt-ts";

const prisma = new PrismaClient();

async function main() {
	console.log("🔄 Seeding database...");

	// ----- Permissions -----
	const allPermissions = Object.values(PermissionType);
	const establishmentOwnerPermissions: PermissionType[] = [
		PermissionType.MANAGE_PRODUCTS,
		PermissionType.MANAGE_CATEGORIES,
		PermissionType.MANAGE_PRODUCT_OPTIONS,
		PermissionType.MANAGE_DISTRICTS,
		PermissionType.MANAGE_ORDERS,
		PermissionType.MANAGE_OWN_STORE,
		PermissionType.MANAGE_BANNERS,
		PermissionType.MANAGE_COUPONS,
		PermissionType.VIEW_CUSTOMERS
	];
	const clientPermissions: PermissionType[] = [
		PermissionType.VIEW_CATALOG,
		PermissionType.ADD_TO_CART,
		PermissionType.MANAGE_ADDRESSES,
		PermissionType.VIEW_OWN_ORDERS,
		PermissionType.CANCEL_OWN_ORDER
	];

	await prisma.permission.createMany({
		data: allPermissions.map(name => ({ name })),
		skipDuplicates: true
	});

	// ----- Roles -----
	const roles = await Promise.all([
		prisma.role.create({
			data: {
				name: RoleType.ADMIN,
				permissions: {
					create: allPermissions.map(name => ({
						permission: {
							connect: { name }
						}
					}))
				}
			}
		}),
		prisma.role.create({
			data: {
				name: RoleType.ESTABLISHMENT_OWNER,
				permissions: {
					create: allPermissions
						.filter(p => establishmentOwnerPermissions.includes(p))
						.map(name => ({ permission: { connect: { name } } }))
				}
			}
		}),
		prisma.role.create({
			data: {
				name: RoleType.CLIENT,
				permissions: {
					create: allPermissions
						.filter(p => clientPermissions.includes(p))
						.map(name => ({ permission: { connect: { name } } }))
				}
			}
		})
	]);

	const adminRole = roles.find(r => r.name === RoleType.ADMIN)!;

	// ----- Admin user -----
	await prisma.user.create({
		data: {
			name: "Admin",
			email: "admin@delivery.com",
			password: await hash("admin123", Constants.HASH_SALT_LENGTH),
			role_id: adminRole.id
		}
	});

	// ----- Establishment -----
	const establishment = await prisma.establishment.create({
		data: {
			name: "Pizzaria do Jair",
			slug: "pizzaria-do-jair",
			logo_url: "https://avatar.iran.liara.run/public/17",
			address: "Rua Principal, 123",
			phone: "11999999999",
			description: "A melhor pizzaria da região!",
			email: "contato@pizzariadojair.com",
			accepts_credit_card: true,
			only_delivery: false
		}
	});

	// ----- Product Category -----
	const categories: ProductCategory[] =
		await prisma.productCategory.createManyAndReturn({
			data: [
				{
					name: "Bebidas",
					slug: "bebidas",
					establishment_id: establishment.id
				},
				{
					name: "Pizzas",
					slug: "pizzas",
					establishment_id: establishment.id
				},
				{
					name: "Hambúrgueres",
					slug: "hamburgueres",
					establishment_id: establishment.id
				}
			]
		});

	// ----- Product -----
	const products: Product[] = await prisma.product.createManyAndReturn({
		data: [
			{
				name: "Coca Cola 2L",
				slug: slugify("Coca Cola 2L"),
				description: "Refrigerante Coca-cola de 2 litros tamanho família.",
				price: transformPriceToDatabase(12),
				image_url: "https://placehold.co/100x100",
				establishment_id: establishment.id,
				category_id: categories[1].id
			},
			{
				name: "Pizza Calabresa",
				slug: slugify("Pizza Calabresa"),
				description: "Deliciosa pizza de calabresa com cebola.",
				price: transformPriceToDatabase(24),
				image_url: "https://placehold.co/100x100",
				establishment_id: establishment.id,
				category_id: categories[1].id
			},
			{
				name: "X-Tudo",
				slug: slugify("X-Tudo"),
				description: "Delicioso hambúrguer com tudo o que você tem direito!",
				price: transformPriceToDatabase(17.5),
				image_url: "https://placehold.co/100x100",
				establishment_id: establishment.id,
				category_id: categories[1].id
			}
		]
	});

	// ----- Addon Category -----
	const addonCategories: AddonCategory[] =
		await prisma.addonCategory.createManyAndReturn({
			data: [
				{
					name: "Bordas",
					type: AddonType.Selection,
					establishment_id: establishment.id
				},
				{
					name: "Queijos",
					type: AddonType.Quantity,
					establishment_id: establishment.id
				}
			]
		});

	await prisma.addon.createMany({
		data: [
			{ name: "Sem borda", price: 0, category_id: addonCategories[0].id },
			{
				name: "Catupiry",
				price: transformPriceToDatabase(5),
				category_id: addonCategories[0].id
			},
			{
				name: "Cheddar",
				price: transformPriceToDatabase(4),
				category_id: addonCategories[0].id
			},
			{
				name: "Parmesão",
				price: transformPriceToDatabase(3),
				category_id: addonCategories[1].id
			},
			{
				name: "Mussarela",
				price: transformPriceToDatabase(2),
				category_id: addonCategories[1].id
			},
			{
				name: "Cheddar",
				price: transformPriceToDatabase(2),
				category_id: addonCategories[1].id
			}
		]
	});

	// ----- District -----
	await prisma.district.create({
		data: {
			name: "Centro",
			shipping_cost: transformPriceToDatabase(3),
			establishment_id: establishment.id
		}
	});

	// ----- Coupon -----
	await prisma.coupon.createMany({
		data: [
			{
				code: "FRETEGRATIS",
				type: CouponType.Shipping,
				discount_type: DiscountType.Percentage,
				value: transformPriceToDatabase(100),
				establishment_id: establishment.id
			},
			{
				code: "PIZZA10",
				type: CouponType.Order,
				discount_type: DiscountType.Fixed,
				value: transformPriceToDatabase(10),
				establishment_id: establishment.id
			}
		]
	});

	// ----- Banner -----
	await prisma.banner.create({
		data: {
			name: "Promoção de Calabresa",
			image_url: "https://placehold.co/600x300",
			linkType: BannerLinkType.PRODUCT,
			product_id: products[1].id,
			establishment_id: establishment.id
		}
	});

	// ----- Opening Hours -----
	await prisma.openingHour.createMany({
		data: [
			{
				day_of_week: WeekDay.Friday,
				opens_at: "18:00",
				closes_at: "23:00",
				is_closed: false,
				establishment_id: establishment.id
			},
			{
				day_of_week: WeekDay.Saturday,
				opens_at: "18:00",
				closes_at: "23:00",
				is_closed: false,
				establishment_id: establishment.id
			},
			{
				day_of_week: WeekDay.Sunday,
				opens_at: "18:00",
				closes_at: "23:00",
				is_closed: false,
				establishment_id: establishment.id
			}
		]
	});

	// ----- Social Links -----
	await prisma.socialLink.create({
		data: {
			platform: SocialPlatform.Instagram,
			url: "https://instagram.com/pizzariadojair",
			establishment_id: establishment.id
		}
	});

	console.log("✅ Seed finalizado com sucesso.");
}

main()
	.catch(e => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
