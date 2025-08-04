import {
	PrismaClient,
	RoleType,
	PermissionType,
	OrderStatusType,
	DiscountType,
	BannerLinkType,
	SocialPlatform,
	ProductCategory,
	Product,
	AddonCategory,
	AddonType,
	CouponType
} from "../src/generated/prisma";

import { hash } from "bcrypt-ts";
import { transformPriceToDatabase } from "../src/helpers/price";
import Constants from "../src/helpers/constants";
import { slugify } from "../src/helpers/utils";

const prisma = new PrismaClient();

async function main() {
	console.log("🔄 Seeding database...");

	// ----- Permissions -----
	const allPermissions = Object.values(PermissionType);
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
						.filter(
							p => p.startsWith("MANAGE") || p.startsWith("VIEW_CUSTOMERS")
						)
						.map(name => ({ permission: { connect: { name } } }))
				}
			}
		}),
		prisma.role.create({
			data: {
				name: RoleType.CLIENT,
				permissions: {
					create: allPermissions
						.filter(
							p =>
								p.startsWith("VIEW") ||
								p.startsWith("ADD") ||
								p.startsWith("CANCEL")
						)
						.map(name => ({ permission: { connect: { name } } }))
				}
			}
		})
	]);

	const adminRole = roles.find(r => r.name === RoleType.ADMIN)!;
	const establishmentOwnerRole = roles.find(
		r => r.name === RoleType.ESTABLISHMENT_OWNER
	)!;
	const clientRole = roles.find(r => r.name === RoleType.CLIENT)!;

	// ----- Admin user -----
	await prisma.user.create({
		data: {
			name: "Admin",
			email: "admin@delivery.com",
			password: await hash("admin123", Constants.HASH_SALT_LENGTH),
			phone: "85996072547",
			roleId: adminRole.id
		}
	});

	// ----- Establishment Owner user -----

	await prisma.user.create({
		data: {
			name: "Jair",
			email: "jair@pizzaria.com",
			password: await hash("jair123", Constants.HASH_SALT_LENGTH),
			phone: "11999999999",
			roleId: establishmentOwnerRole.id
		}
	});

	// ----- Client user -----

	await prisma.user.create({
		data: {
			name: "Cliente",
			email: "cliente@email.com",
			password: await hash("cliente123", Constants.HASH_SALT_LENGTH),
			phone: "11999999999",
			roleId: clientRole.id
		}
	});

	// ----- Establishment -----
	const establishment = await prisma.establishment.create({
		data: {
			name: "Pizzaria do Jair",
			slug: "pizzaria-do-jair",
			logoUrl: "https://avatar.iran.liara.run/public/17",
			address: "Rua Principal, 123",
			phone: "11999999999",
			description: "A melhor pizzaria da região!",
			email: "contato@pizzariadojair.com",
			acceptsCard: true,
			onlyDelivery: false
		}
	});

	// ----- Product Category -----
	const categories: ProductCategory[] =
		await prisma.productCategory.createManyAndReturn({
			data: [
				{
					name: "Bebidas",
					slug: "bebidas",
					establishmentId: establishment.id
				},
				{
					name: "Pizzas",
					slug: "pizzas",
					establishmentId: establishment.id
				},
				{
					name: "Hambúrgueres",
					slug: "hamburgueres",
					establishmentId: establishment.id
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
				imageUrl: "https://placehold.co/100x100",
				establishmentId: establishment.id,
				categoryId: categories[1].id
			},
			{
				name: "Pizza Calabresa",
				slug: slugify("Pizza Calabresa"),
				description: "Deliciosa pizza de calabresa com cebola.",
				price: transformPriceToDatabase(24),
				imageUrl: "https://placehold.co/100x100",
				establishmentId: establishment.id,
				categoryId: categories[1].id
			},
			{
				name: "X-Tudo",
				slug: slugify("X-Tudo"),
				description: "Delicioso hambúrguer com tudo o que você tem direito!",
				price: transformPriceToDatabase(17.5),
				imageUrl: "https://placehold.co/100x100",
				establishmentId: establishment.id,
				categoryId: categories[1].id
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
					establishmentId: establishment.id
				},
				{
					name: "Queijos",
					type: AddonType.Quantity,
					establishmentId: establishment.id
				}
			]
		});

	await prisma.addon.createMany({
		data: [
			{ name: "Sem borda", price: 0, categoryId: addonCategories[0].id },
			{
				name: "Catupiry",
				price: transformPriceToDatabase(5),
				categoryId: addonCategories[0].id
			},
			{
				name: "Cheddar",
				price: transformPriceToDatabase(4),
				categoryId: addonCategories[0].id
			},
			{
				name: "Parmesão",
				price: transformPriceToDatabase(3),
				categoryId: addonCategories[1].id
			},
			{
				name: "Mussarela",
				price: transformPriceToDatabase(2),
				categoryId: addonCategories[1].id
			},
			{
				name: "Cheddar",
				price: transformPriceToDatabase(2),
				categoryId: addonCategories[1].id
			}
		]
	});

	// ----- District -----
	await prisma.district.create({
		data: {
			name: "Centro",
			shippingCost: transformPriceToDatabase(3),
			establishmentId: establishment.id
		}
	});

	// ----- Coupon -----
	await prisma.coupon.createMany({
		data: [
			{
				code: "FRETEGRATIS",
				type: CouponType.Shipping,
				discountType: DiscountType.Percentage,
				value: transformPriceToDatabase(100),
				establishmentId: establishment.id
			},
			{
				code: "PIZZA10",
				type: CouponType.Order,
				discountType: DiscountType.Fixed,
				value: transformPriceToDatabase(10),
				establishmentId: establishment.id
			}
		]
	});

	// ----- Order Status -----
	const orderStatuses = Object.values(OrderStatusType);
	await prisma.orderStatus.createMany({
		data: orderStatuses.map(value => ({
			value,
			label: value
		})),
		skipDuplicates: true
	});

	// ----- Banner -----
	await prisma.banner.create({
		data: {
			name: "Promoção de Calabresa",
			imageUrl: "https://placehold.co/600x300",
			linkType: BannerLinkType.PRODUCT,
			productId: products[1].id,
			establishmentId: establishment.id
		}
	});

	// ----- Opening Hours -----
	await prisma.openingHour.createMany({
		data: [
			{
				dayOfWeek: "Monday",
				opensAt: "18:00",
				closesAt: "23:00",
				isClosed: false,
				establishmentId: establishment.id
			},
			{
				dayOfWeek: "Tuesday",
				opensAt: "18:00",
				closesAt: "23:00",
				isClosed: false,
				establishmentId: establishment.id
			},
			{
				dayOfWeek: "Wednesday",
				opensAt: "18:00",
				closesAt: "23:00",
				isClosed: false,
				establishmentId: establishment.id
			}
		]
	});

	// ----- Social Links -----
	await prisma.socialLink.create({
		data: {
			platform: SocialPlatform.Instagram,
			url: "https://instagram.com/pizzariadojair",
			establishmentId: establishment.id
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
