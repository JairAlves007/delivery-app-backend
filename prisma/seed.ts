import Constants from "@/helpers/constants.ts";
import { transformPriceToDatabase } from "@/helpers/price.ts";
import { slugify } from "@/helpers/utils.ts";
import {
	AddonType,
	BannerLinkType,
	CouponType,
	DiscountType,
	FileFormatType,
	PermissionType,
	Prisma,
	PrismaClient,
	RoleType,
	SocialPlatform,
	TagType,
	WeekDay,
	type AddonCategory,
	type Product,
	type ProductCategory
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
		PermissionType.CANCEL_ORDERS,
		PermissionType.MANAGE_OWN_ESTABLISHMENT,
		PermissionType.MANAGE_BANNERS,
		PermissionType.MANAGE_COUPONS,
		PermissionType.VIEW_CUSTOMERS
	];
	const customerPermissions: PermissionType[] = [
		PermissionType.VIEW_CATALOG,
		PermissionType.ADD_TO_CART,
		PermissionType.MANAGE_OWN_ADDRESSES,
		PermissionType.MANAGE_OWN_ORDERS
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
				name: RoleType.CUSTOMER,
				permissions: {
					create: allPermissions
						.filter(p => customerPermissions.includes(p))
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
			description: "A melhor pizzaria da região!",
			email: "contato@pizzariadojair.com",
			accepts_credit_card: true,
			only_delivery: false,
			next_billing_date: new Date("2030-06-12T12:06:24")
		}
	});

	const address = await prisma.address.create({
		data: {
			city: "Cidade",
			phone: "11999999999",
			state: "Estado",
			neighborhood: "Bairro",
			street: "Rua Principal",
			number: "123",
			postal_code: "12345678"
		}
	});

	await prisma.establishmentAddress.create({
		data: {
			establishment_id: establishment.id,
			address_id: address.id
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
				establishment_id: establishment.id,
				category_id: categories[1].id
			},
			{
				name: "Pizza Calabresa",
				slug: slugify("Pizza Calabresa"),
				description: "Deliciosa pizza de calabresa com cebola.",
				price: transformPriceToDatabase(24),
				establishment_id: establishment.id,
				category_id: categories[1].id
			},
			{
				name: "X-Tudo",
				slug: slugify("X-Tudo"),
				description: "Delicioso hambúrguer com tudo o que você tem direito!",
				price: transformPriceToDatabase(17.5),
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
					type: AddonType.MULTIPLE_CHOICE,
					establishment_id: establishment.id
				},
				{
					name: "Queijos",
					type: AddonType.QUANTITY,
					establishment_id: establishment.id,
					max_quantity: 3
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

	const tagLabel = {
		[TagType.ALCOHOLIC_DRINK]: "Bebidas alcoólicas",
		[TagType.APPETIZER]: "Aperitivos",
		[TagType.BREAKFAST]: "Cafe da manhã",
		[TagType.BURGER]: "Hambúrgueres",
		[TagType.CAKE]: "Bolos",
		[TagType.COFFEE]: "Café",
		[TagType.COLD_DRINK]: "Bebidas frias",
		[TagType.COMBO]: "Combos",
		[TagType.COOKIE]: "Biscoitos",
		[TagType.DESSERT]: "Sobremesas",
		[TagType.DINNER]: "Jantar",
		[TagType.DRINK]: "Bebidas",
		[TagType.FISH]: "Peixes",
		[TagType.FOOD]: "Alimentos",
		[TagType.FRUIT]: "Frutas",
		[TagType.GLUTEN_FREE]: "Sem Glúten",
		[TagType.GRILL]: "Churrasco",
		[TagType.HOT_DRINK]: "Bebidas quentes",
		[TagType.ICE_CREAM]: "Sorvetes",
		[TagType.JUICE]: "Sucos",
		[TagType.LUNCH]: "Almoço",
		[TagType.MEAT]: "Carnes",
		[TagType.MILK_SHAKE]: "Milk Shakes",
		[TagType.NON_ALCOHOLIC_DRINK]: "Bebidas não alcoólicas",
		[TagType.PASTA]: "Massas",
		[TagType.PASTRY]: "Padarias",
		[TagType.PIE]: "Tortas",
		[TagType.PIZZA]: "Pizzas",
		[TagType.SALAD]: "Saladas",
		[TagType.SANDWICH]: "Sanduíches",
		[TagType.SIDE]: "Entradas",
		[TagType.SMOOTHIE]: "Smoothies",
		[TagType.SNACK]: "Snacks",
		[TagType.SODA]: "Refrigerantes",
		[TagType.SOUP]: "Sopas",
		[TagType.SUSHI]: "Sushi",
		[TagType.TEA]: "Chá",
		[TagType.VEGAN]: "Vegano",
		[TagType.VEGETABLE]: "Vegetais",
		[TagType.VEGETARIAN]: "Vegetariano"
	} as const;

	// ----- Tags -----
	const tagsData = Object.values(TagType).map(tag => ({
		type: tag,
		label: tagLabel[tag],
		establishment_id: establishment.id
	}));

	const tags = await prisma.tag.createManyAndReturn({
		data: tagsData
	});

	// ----- ProductTags -----
	await prisma.productTag.createMany({
		data: [
			// Coca Cola 2L
			{
				product_id: products[0].id,
				tag_id: tags.find(t => t.type === TagType.COLD_DRINK)!.id
			},
			{
				product_id: products[0].id,
				tag_id: tags.find(t => t.type === TagType.NON_ALCOHOLIC_DRINK)!.id
			},
			{
				product_id: products[0].id,
				tag_id: tags.find(t => t.type === TagType.DRINK)!.id
			},

			// Pizza Calabresa
			{
				product_id: products[1].id,
				tag_id: tags.find(t => t.type === TagType.FOOD)!.id
			},
			{
				product_id: products[1].id,
				tag_id: tags.find(t => t.type === TagType.PIZZA)!.id
			},
			{
				product_id: products[1].id,
				tag_id: tags.find(t => t.type === TagType.LUNCH)!.id
			},
			{
				product_id: products[1].id,
				tag_id: tags.find(t => t.type === TagType.DINNER)!.id
			},

			// X-Tudo
			{
				product_id: products[2].id,
				tag_id: tags.find(t => t.type === TagType.FOOD)!.id
			},
			{
				product_id: products[2].id,
				tag_id: tags.find(t => t.type === TagType.BURGER)!.id
			},
			{
				product_id: products[2].id,
				tag_id: tags.find(t => t.type === TagType.LUNCH)!.id
			},
			{
				product_id: products[2].id,
				tag_id: tags.find(t => t.type === TagType.DINNER)!.id
			}
		]
	});

	// Sugestões para produtos relacionados
	// ----- Tag Combinations -----
	const tagCombinationsData: { from: TagType; to: TagType }[] = [];

	function addCombination(from: TagType, toTags: TagType[]) {
		toTags.forEach(to => {
			tagCombinationsData.push({ from, to });
			tagCombinationsData.push({ from: to, to: from });
		});
	}

	// ----- Definir combinações -----
	// Café
	addCombination(TagType.HOT_DRINK, [
		TagType.PASTRY,
		TagType.DESSERT,
		TagType.MILK_SHAKE,
		TagType.JUICE,
		TagType.CAKE,
		TagType.COFFEE,
		TagType.TEA
	]);

	// Bebidas frias
	addCombination(TagType.COLD_DRINK, [
		TagType.SODA,
		TagType.MILK_SHAKE,
		TagType.JUICE,
		TagType.SMOOTHIE,
		TagType.ICE_CREAM
	]);

	// Sucos e Milkshakes
	addCombination(TagType.JUICE, [TagType.FRUIT, TagType.SNACK]);
	addCombination(TagType.MILK_SHAKE, [TagType.DESSERT, TagType.PASTRY]);

	// Pizza
	addCombination(TagType.PIZZA, [TagType.COLD_DRINK, TagType.SIDE]);

	// Hambúrguer
	addCombination(TagType.BURGER, [TagType.COLD_DRINK, TagType.SIDE]);

	// Sanduíches
	addCombination(TagType.SANDWICH, [TagType.COLD_DRINK, TagType.SIDE]);

	// Sobremesas
	addCombination(TagType.DESSERT, [
		TagType.COFFEE,
		TagType.TEA,
		TagType.MILK_SHAKE
	]);

	// Saladas
	addCombination(TagType.SALAD, [TagType.SIDE, TagType.DRINK]);

	// Massas
	addCombination(TagType.PASTA, [TagType.DRINK, TagType.SIDE]);

	// Sushi e Grill
	addCombination(TagType.SUSHI, [TagType.SIDE, TagType.DRINK]);
	addCombination(TagType.GRILL, [TagType.SIDE, TagType.DRINK]);

	// Proteínas
	addCombination(TagType.MEAT, [TagType.SIDE, TagType.SALAD]);
	addCombination(TagType.FISH, [TagType.SIDE, TagType.SALAD]);

	// Dietas especiais
	addCombination(TagType.VEGAN, [TagType.SIDE, TagType.SALAD]);
	addCombination(TagType.VEGETARIAN, [TagType.SIDE, TagType.SALAD]);
	addCombination(TagType.GLUTEN_FREE, [TagType.SIDE, TagType.SALAD]);

	// Doces
	addCombination(TagType.CAKE, [TagType.COFFEE, TagType.TEA]);
	addCombination(TagType.COOKIE, [TagType.COFFEE, TagType.TEA]);
	addCombination(TagType.PIE, [TagType.COFFEE, TagType.TEA]);

	// Criar no banco
	await prisma.tagCombination.createMany({
		data: tagCombinationsData.map(tc => ({
			from_tag_id: tags.find(t => t.type === tc.from)!.id,
			to_tag_id: tags.find(t => t.type === tc.to)!.id
		})),
		skipDuplicates: true
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
				type: CouponType.SHIPPING,
				discount_type: DiscountType.PERCENTAGE,
				value: 100,
				establishment_id: establishment.id
			},
			{
				code: "PIZZA10",
				type: CouponType.ORDER,
				discount_type: DiscountType.FIXED,
				value: transformPriceToDatabase(10),
				establishment_id: establishment.id
			}
		]
	});

	// ----- Banner -----
	await prisma.banner.create({
		data: {
			name: "Promoção de Calabresa",
			link_type: BannerLinkType.PRODUCT,
			product_id: products[1].id,
			establishment_id: establishment.id
		}
	});

	// ----- Opening Hours -----
	await prisma.openingHour.createMany({
		data: [
			{
				day_of_week: WeekDay.SUNDAY,
				opens_at: "18:00",
				closes_at: "23:00",
				is_closed: false,
				establishment_id: establishment.id
			},
			{
				day_of_week: WeekDay.MONDAY,
				opens_at: "18:00",
				closes_at: "23:00",
				is_closed: false,
				establishment_id: establishment.id
			},
			{
				day_of_week: WeekDay.TUESDAY,
				opens_at: "18:00",
				closes_at: "23:00",
				is_closed: false,
				establishment_id: establishment.id
			},
			{
				day_of_week: WeekDay.WEDNESDAY,
				opens_at: "18:00",
				closes_at: "23:00",
				is_closed: false,
				establishment_id: establishment.id
			},
			{
				day_of_week: WeekDay.THURSDAY,
				opens_at: "18:00",
				closes_at: "23:00",
				is_closed: false,
				establishment_id: establishment.id
			},
			{
				day_of_week: WeekDay.FRIDAY,
				opens_at: "18:00",
				closes_at: "23:00",
				is_closed: false,
				establishment_id: establishment.id
			},
			{
				day_of_week: WeekDay.SATURDAY,
				opens_at: "18:00",
				closes_at: "23:00",
				is_closed: true,
				establishment_id: establishment.id
			}
		]
	});

	// ----- Social Links -----
	await prisma.socialLink.create({
		data: {
			platform: SocialPlatform.INSTAGRAM,
			url: "https://instagram.com/pizzariadojair",
			establishment_id: establishment.id
		}
	});

	const customerMenuItems: Prisma.MenuCreateManyInput[] = [
		{
			label: "Cardápio",
			slug: "catalog",
			establishment_id: establishment.id,
			order: 1,
			for_role: RoleType.CUSTOMER
		},
		{
			label: "Sacola",
			slug: "bag",
			establishment_id: establishment.id,
			order: 2,
			for_role: RoleType.CUSTOMER
		},
		{
			label: "Favoritos",
			slug: "favorites",
			establishment_id: establishment.id,
			order: 3,
			for_role: RoleType.CUSTOMER
		},
		{
			label: "Meus Pedidos",
			slug: "orders",
			establishment_id: establishment.id,
			order: 4,
			for_role: RoleType.CUSTOMER
		},
		{
			label: "Meus Endereços",
			slug: "addresses",
			establishment_id: establishment.id,
			order: 5,
			for_role: RoleType.CUSTOMER
		}
	];

	const establishmentOwnerMenuItems: Prisma.MenuCreateManyInput[] = [
		{
			label: "Produtos",
			slug: "products",
			establishment_id: establishment.id,
			order: 4,
			for_role: RoleType.ESTABLISHMENT_OWNER
		},
		{
			label: "Categorias dos Produtos",
			slug: "product-categories",
			establishment_id: establishment.id,
			order: 5,
			for_role: RoleType.ESTABLISHMENT_OWNER
		},
		{
			label: "Pedidos",
			slug: "orders",
			establishment_id: establishment.id,
			order: 6,
			for_role: RoleType.ESTABLISHMENT_OWNER
		},
		{
			label: "Cupons",
			slug: "coupons",
			establishment_id: establishment.id,
			order: 7,
			for_role: RoleType.ESTABLISHMENT_OWNER
		}
	];

	const adminMenuItems: Prisma.MenuCreateManyInput[] = [
		{
			label: "Dashboard",
			slug: "dashboard",
			establishment_id: establishment.id,
			order: 1,
			for_role: RoleType.ADMIN
		},
		{
			label: "Estabelecimentos",
			slug: "establishments",
			establishment_id: establishment.id,
			order: 2,
			for_role: RoleType.ADMIN
		},
		{
			label: "Clientes",
			slug: "customers",
			establishment_id: establishment.id,
			order: 3,
			for_role: RoleType.ADMIN
		},
		...establishmentOwnerMenuItems.map(menu => ({
			...menu,
			for_role: RoleType.ADMIN
		}))
	];

	await prisma.menu.createMany({
		data: customerMenuItems
	});

	const establishmentOwnerMenus = await prisma.menu.createManyAndReturn({
		data: establishmentOwnerMenuItems
	});

	const adminMenus = await prisma.menu.createManyAndReturn({
		data: adminMenuItems
	});

	const establishmentOwnerSubmenuItems: Prisma.SubMenuCreateManyInput[] = [
		{
			label: "Ver produtos",
			slug: "view-products",
			order: 1,
			menu_id: establishmentOwnerMenus[0].id
		},
		{
			label: "Criar produto",
			slug: "create-product",
			order: 2,
			menu_id: establishmentOwnerMenus[0].id
		},
		{
			label: "Ver categorias dos produtos",
			slug: "view-product-categories",
			order: 1,
			menu_id: establishmentOwnerMenus[1].id
		},
		{
			label: "Criar categoria de produto",
			slug: "create-product-category",
			order: 2,
			menu_id: establishmentOwnerMenus[1].id
		},
		{
			label: "Ver cupons",
			slug: "view-coupons",
			order: 1,
			menu_id: establishmentOwnerMenus[3].id
		},
		{
			label: "Criar cupom",
			slug: "create-coupon",
			order: 2,
			menu_id: establishmentOwnerMenus[3].id
		}
	];

	const adminSubmenuItems: Prisma.SubMenuCreateManyInput[] = [
		{
			label: "Ver estabelecimentos",
			slug: "view-establishments",
			order: 1,
			menu_id: adminMenus[1].id
		},
		{
			label: "Criar estabelecimento",
			slug: "create-establishment",
			order: 2,
			menu_id: adminMenus[1].id
		},
		{
			label: "Ver clientes",
			slug: "view-customers",
			order: 1,
			menu_id: adminMenus[2].id
		},
		{
			label: "Ver produtos",
			slug: "view-products",
			order: 1,
			menu_id: adminMenus[3].id
		},
		{
			label: "Criar produto",
			slug: "create-product",
			order: 2,
			menu_id: adminMenus[3].id
		},
		{
			label: "Ver categorias dos produtos",
			slug: "view-product-categories",
			order: 1,
			menu_id: adminMenus[4].id
		},
		{
			label: "Criar categoria de produto",
			slug: "create-product-category",
			order: 2,
			menu_id: adminMenus[4].id
		},
		{
			label: "Ver cupons",
			slug: "view-coupons",
			order: 1,
			menu_id: adminMenus[6].id
		},
		{
			label: "Criar cupom",
			slug: "create-coupon",
			order: 2,
			menu_id: adminMenus[6].id
		}
	];

	await prisma.subMenu.createMany({
		data: establishmentOwnerSubmenuItems
	});

	await prisma.subMenu.createMany({
		data: adminSubmenuItems
	});

	const resourceRules = await prisma.resourceRule.createManyAndReturn({
		data: [
			{
				type: "BANNER",
				for: "PRODUCT",
				width: 1920,
				height: 1080,
				establishment_id: establishment.id
			},
			{
				type: "THUMBNAIL",
				for: "PRODUCT",
				width: 320,
				height: 320,
				establishment_id: establishment.id
			},
			{
				type: "LOGO",
				for: "ESTABLISHMENT",
				width: 200,
				height: 200,
				establishment_id: establishment.id
			},
			{
				type: "BANNER",
				for: "ESTABLISHMENT",
				width: 1920,
				height: 1080,
				establishment_id: establishment.id
			},
			{
				type: "THUMBNAIL",
				for: "CATEGORY",
				width: 320,
				height: 320,
				establishment_id: establishment.id
			},
			{
				type: "BANNER",
				for: "BANNER",
				width: 1920,
				height: 1080,
				establishment_id: establishment.id
			}
		]
	});

	await prisma.fileFormat.createMany({
		data: [
			{
				type: FileFormatType.JPG,
				resource_rule_id: resourceRules[0].id
			},
			{
				type: FileFormatType.JPEG,
				resource_rule_id: resourceRules[0].id
			},
			{
				type: FileFormatType.PNG,
				resource_rule_id: resourceRules[0].id
			},
			{
				type: FileFormatType.JPG,
				resource_rule_id: resourceRules[1].id
			},
			{
				type: FileFormatType.JPEG,
				resource_rule_id: resourceRules[1].id
			},
			{
				type: FileFormatType.PNG,
				resource_rule_id: resourceRules[1].id
			},
			{
				type: FileFormatType.JPG,
				resource_rule_id: resourceRules[2].id
			},
			{
				type: FileFormatType.JPEG,
				resource_rule_id: resourceRules[2].id
			},
			{
				type: FileFormatType.PNG,
				resource_rule_id: resourceRules[2].id
			},
			{
				type: FileFormatType.JPG,
				resource_rule_id: resourceRules[3].id
			},
			{
				type: FileFormatType.JPEG,
				resource_rule_id: resourceRules[3].id
			},
			{
				type: FileFormatType.PNG,
				resource_rule_id: resourceRules[3].id
			},
			{
				type: FileFormatType.JPG,
				resource_rule_id: resourceRules[4].id
			},
			{
				type: FileFormatType.JPEG,
				resource_rule_id: resourceRules[4].id
			},
			{
				type: FileFormatType.PNG,
				resource_rule_id: resourceRules[4].id
			}
		]
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
