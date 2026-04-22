import { hash } from "bcrypt-ts";

import {
	AddonType,
	BannerLinkType,
	CouponType,
	DiscountType,
	FileFormatType,
	PermissionType,
	RoleType,
	SocialPlatform,
	TagType,
	WeekDay
} from "@/generated/prisma/client.js";
import Constants from "@/helpers/constants.js";
import { transformPriceToDatabase } from "@/helpers/price.js";
import { slugify } from "@/helpers/utils.js";
import prisma from "@/lib/prisma.js";

type AddonSeed = { name: string; price: number };
type AddonCategorySeed = {
	name: string;
	type: AddonType;
	max_quantity?: number;
	addons: AddonSeed[];
};

type ProductSeed = {
	name: string;
	description: string;
	price: number;
	category: string;
	tags: TagType[];
	discount_percentage?: number;
};

type CategorySeed = { name: string; order: number };

type DistrictSeed = { name: string; shipping_cost: number };

type CouponSeed = {
	code: string;
	type: CouponType;
	discount_type: DiscountType;
	value: number;
};

type OpeningHourSeed = {
	day_of_week: WeekDay;
	opens_at: string;
	closes_at: string;
	is_closed: boolean;
};

type SocialLinkSeed = { platform: SocialPlatform; url: string };

type BannerSeed = { name: string; product_name: string };

type EstablishmentSeed = {
	name: string;
	slug: string;
	description: string;
	email: string;
	cnpj?: string;
	accepts_credit_card: boolean;
	only_delivery: boolean;
	ownerEmail: string;
	ownerName: string;
	ownerPhone: string;
	address: {
		street: string;
		number: string;
		neighborhood: string;
		city: string;
		state: string;
		postal_code: string;
		phone: string;
	};
	categories: CategorySeed[];
	products: ProductSeed[];
	addonCategories: AddonCategorySeed[];
	productTags: Record<string, TagType[]>;
	tagCombinations: { from: TagType; to: TagType[] }[];
	districts: DistrictSeed[];
	coupons: CouponSeed[];
	banners: BannerSeed[];
	openingHours: OpeningHourSeed[];
	socialLinks: SocialLinkSeed[];
};

const tagLabel: Record<TagType, string> = {
	[TagType.ALCOHOLIC_DRINK]: "Bebidas alcoólicas",
	[TagType.APPETIZER]: "Aperitivos",
	[TagType.BREAKFAST]: "Café da manhã",
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
};

const standardWeekHours = (
	opens: string,
	closes: string,
	closedOn: WeekDay[] = []
): OpeningHourSeed[] =>
	Object.values(WeekDay).map(day => ({
		day_of_week: day as WeekDay,
		opens_at: opens,
		closes_at: closes,
		is_closed: closedOn.includes(day as WeekDay)
	}));

const milkShakeMix: EstablishmentSeed = {
	name: "Milk Shake Mix Acarape",
	slug: "milk-shake-mix-acarape",
	description:
		"Sorveteria e milk shakes artesanais em Acarape. Variedade de sabores, açaí na tigela, sundaes e sobremesas geladas feitas com ingredientes selecionados.",
	email: "contato@milkshakemixacarape.com.br",
	cnpj: "12.345.678/0001-91",
	accepts_credit_card: true,
	only_delivery: false,
	ownerEmail: "donocarlos@milkshakemixacarape.com.br",
	ownerName: "Carlos Eduardo",
	ownerPhone: "85999887766",
	address: {
		street: "Rua Coronel Pedro Catão",
		number: "245",
		neighborhood: "Centro",
		city: "Acarape",
		state: "CE",
		postal_code: "62785000",
		phone: "85998765432"
	},
	categories: [
		{ name: "Milk Shakes", order: 1 },
		{ name: "Sorvetes", order: 2 },
		{ name: "Açaí", order: 3 },
		{ name: "Sundaes", order: 4 },
		{ name: "Bebidas", order: 5 }
	],
	products: [
		{
			name: "Milk Shake de Ovomaltine 500ml",
			description:
				"Milk shake cremoso batido com sorvete de baunilha, leite gelado e farelo crocante de Ovomaltine.",
			price: transformPriceToDatabase(18.9),
			category: "Milk Shakes",
			tags: [TagType.MILK_SHAKE, TagType.COLD_DRINK, TagType.DESSERT]
		},
		{
			name: "Milk Shake de Nutella 500ml",
			description:
				"Sorvete de creme batido com leite e generosa quantidade de Nutella, finalizado com chantilly.",
			price: transformPriceToDatabase(21.9),
			category: "Milk Shakes",
			tags: [TagType.MILK_SHAKE, TagType.COLD_DRINK, TagType.DESSERT]
		},
		{
			name: "Milk Shake de Morango 500ml",
			description:
				"Milk shake tradicional de morango com pedaços da fruta e sorvete cremoso.",
			price: transformPriceToDatabase(17.5),
			category: "Milk Shakes",
			tags: [TagType.MILK_SHAKE, TagType.FRUIT, TagType.COLD_DRINK]
		},
		{
			name: "Milk Shake de Oreo 500ml",
			description:
				"Milk shake de baunilha com biscoitos Oreo triturados, decorado com calda de chocolate.",
			price: transformPriceToDatabase(19.9),
			category: "Milk Shakes",
			tags: [TagType.MILK_SHAKE, TagType.COOKIE, TagType.DESSERT]
		},
		{
			name: "Sorvete de Flocos (bola)",
			description:
				"Bola de sorvete cremoso de flocos com raspas de chocolate ao leite.",
			price: transformPriceToDatabase(6),
			category: "Sorvetes",
			tags: [TagType.ICE_CREAM, TagType.DESSERT]
		},
		{
			name: "Sorvete de Chocolate Belga (bola)",
			description:
				"Sorvete cremoso feito com puro chocolate belga meio amargo.",
			price: transformPriceToDatabase(7.5),
			category: "Sorvetes",
			tags: [TagType.ICE_CREAM, TagType.DESSERT]
		},
		{
			name: "Açaí na Tigela 500ml",
			description:
				"Açaí batido com banana, acompanhado de granola, leite condensado e banana em rodelas.",
			price: transformPriceToDatabase(22),
			category: "Açaí",
			tags: [TagType.FRUIT, TagType.DESSERT, TagType.COLD_DRINK]
		},
		{
			name: "Açaí com Morango 300ml",
			description:
				"Açaí gelado servido com morangos frescos, granola crocante e mel.",
			price: transformPriceToDatabase(16),
			category: "Açaí",
			tags: [TagType.FRUIT, TagType.DESSERT, TagType.COLD_DRINK]
		},
		{
			name: "Sundae Chocolate",
			description:
				"Três bolas de sorvete de creme com calda quente de chocolate e amendoim torrado.",
			price: transformPriceToDatabase(14.9),
			category: "Sundaes",
			tags: [TagType.ICE_CREAM, TagType.DESSERT]
		},
		{
			name: "Sundae Morango",
			description:
				"Sorvete de creme com calda de morango, chantilly e confeitos coloridos.",
			price: transformPriceToDatabase(13.9),
			category: "Sundaes",
			tags: [TagType.ICE_CREAM, TagType.FRUIT, TagType.DESSERT]
		},
		{
			name: "Coca Cola Lata 350ml",
			description: "Refrigerante Coca-Cola gelado em lata de 350ml.",
			price: transformPriceToDatabase(6),
			category: "Bebidas",
			tags: [TagType.SODA, TagType.COLD_DRINK, TagType.NON_ALCOHOLIC_DRINK]
		},
		{
			name: "Suco de Laranja Natural 500ml",
			description:
				"Suco de laranja feito na hora, sem adição de açúcar ou conservantes.",
			price: transformPriceToDatabase(9),
			category: "Bebidas",
			tags: [TagType.JUICE, TagType.COLD_DRINK, TagType.FRUIT]
		}
	],
	addonCategories: [
		{
			name: "Coberturas",
			type: AddonType.MULTIPLE_CHOICE,
			addons: [
				{ name: "Calda de Chocolate", price: transformPriceToDatabase(2) },
				{ name: "Calda de Morango", price: transformPriceToDatabase(2) },
				{ name: "Leite Condensado", price: transformPriceToDatabase(2) },
				{ name: "Caramelo", price: transformPriceToDatabase(2.5) }
			]
		},
		{
			name: "Adicionais",
			type: AddonType.QUANTITY,
			max_quantity: 5,
			addons: [
				{ name: "Granola", price: transformPriceToDatabase(3) },
				{ name: "Paçoca", price: transformPriceToDatabase(2.5) },
				{ name: "Ovomaltine", price: transformPriceToDatabase(3.5) },
				{ name: "Oreo Triturado", price: transformPriceToDatabase(3) },
				{ name: "M&Ms", price: transformPriceToDatabase(3.5) },
				{ name: "Morango Fresco", price: transformPriceToDatabase(4) }
			]
		},
		{
			name: "Tamanho",
			type: AddonType.MULTIPLE_CHOICE,
			addons: [
				{ name: "Pequeno (300ml)", price: 0 },
				{ name: "Médio (500ml)", price: transformPriceToDatabase(3) },
				{ name: "Grande (700ml)", price: transformPriceToDatabase(6) }
			]
		}
	],
	productTags: {},
	tagCombinations: [
		{
			from: TagType.MILK_SHAKE,
			to: [TagType.DESSERT, TagType.COOKIE, TagType.FRUIT]
		},
		{
			from: TagType.ICE_CREAM,
			to: [TagType.DESSERT, TagType.FRUIT, TagType.COOKIE]
		},
		{ from: TagType.COLD_DRINK, to: [TagType.JUICE, TagType.SODA] }
	],
	districts: [
		{ name: "Centro", shipping_cost: transformPriceToDatabase(3) },
		{ name: "Cruz", shipping_cost: transformPriceToDatabase(5) },
		{ name: "Palmeiras", shipping_cost: transformPriceToDatabase(6) },
		{ name: "Ibaretama", shipping_cost: transformPriceToDatabase(8) }
	],
	coupons: [
		{
			code: "MIXBEMVINDO",
			type: CouponType.ORDER,
			discount_type: DiscountType.PERCENTAGE,
			value: 10
		},
		{
			code: "FRETEMIX",
			type: CouponType.SHIPPING,
			discount_type: DiscountType.PERCENTAGE,
			value: 100
		}
	],
	banners: [
		{ name: "Destaque Nutella", product_name: "Milk Shake de Nutella 500ml" },
		{ name: "Açaí Tropical", product_name: "Açaí na Tigela 500ml" }
	],
	openingHours: standardWeekHours("14:00", "22:30", [WeekDay.MONDAY]),
	socialLinks: [
		{
			platform: SocialPlatform.INSTAGRAM,
			url: "https://instagram.com/milkshakemixacarape"
		},
		{
			platform: SocialPlatform.WHATSAPP,
			url: "https://wa.me/5585998765432"
		}
	]
};

const pizzariaBellaNapoli: EstablishmentSeed = {
	name: "Pizzaria Bella Napoli",
	slug: "pizzaria-bella-napoli",
	description:
		"Pizzaria artesanal com massa de fermentação natural, ingredientes frescos e receitas tradicionais italianas. Forno a lenha e entrega rápida.",
	email: "contato@bellanapoli.com.br",
	cnpj: "23.456.789/0001-82",
	accepts_credit_card: true,
	only_delivery: false,
	ownerEmail: "marco@bellanapoli.com.br",
	ownerName: "Marco Antônio",
	ownerPhone: "85991122334",
	address: {
		street: "Avenida Dom Luís",
		number: "1233",
		neighborhood: "Aldeota",
		city: "Fortaleza",
		state: "CE",
		postal_code: "60160230",
		phone: "85987654321"
	},
	categories: [
		{ name: "Pizzas Tradicionais", order: 1 },
		{ name: "Pizzas Especiais", order: 2 },
		{ name: "Pizzas Doces", order: 3 },
		{ name: "Calzones", order: 4 },
		{ name: "Entradas", order: 5 },
		{ name: "Bebidas", order: 6 }
	],
	products: [
		{
			name: "Pizza Margherita",
			description:
				"Molho de tomate San Marzano, mussarela de búfala, manjericão fresco e azeite extra virgem.",
			price: transformPriceToDatabase(49.9),
			category: "Pizzas Tradicionais",
			tags: [TagType.PIZZA, TagType.FOOD, TagType.DINNER, TagType.VEGETARIAN]
		},
		{
			name: "Pizza Calabresa",
			description:
				"Calabresa artesanal fatiada, cebola roxa, mussarela e azeitonas pretas.",
			price: transformPriceToDatabase(52.9),
			category: "Pizzas Tradicionais",
			tags: [TagType.PIZZA, TagType.FOOD, TagType.DINNER, TagType.MEAT]
		},
		{
			name: "Pizza Quatro Queijos",
			description:
				"Mussarela, provolone, gorgonzola e parmesão gratinados sobre molho branco.",
			price: transformPriceToDatabase(58.9),
			category: "Pizzas Tradicionais",
			tags: [TagType.PIZZA, TagType.FOOD, TagType.DINNER, TagType.VEGETARIAN]
		},
		{
			name: "Pizza Portuguesa",
			description:
				"Presunto, mussarela, ovo, cebola, ervilha, azeitona e orégano.",
			price: transformPriceToDatabase(54.9),
			category: "Pizzas Tradicionais",
			tags: [TagType.PIZZA, TagType.FOOD, TagType.DINNER, TagType.MEAT]
		},
		{
			name: "Pizza Parma",
			description:
				"Molho de tomate, mussarela de búfala, presunto parma, rúcula fresca e lascas de parmesão.",
			price: transformPriceToDatabase(69.9),
			category: "Pizzas Especiais",
			tags: [TagType.PIZZA, TagType.FOOD, TagType.DINNER, TagType.MEAT]
		},
		{
			name: "Pizza Pepperoni",
			description:
				"Molho de tomate, mussarela generosa e fatias de pepperoni picante.",
			price: transformPriceToDatabase(64.9),
			category: "Pizzas Especiais",
			tags: [TagType.PIZZA, TagType.FOOD, TagType.DINNER, TagType.MEAT]
		},
		{
			name: "Pizza Chocolate com Morango",
			description:
				"Chocolate ao leite derretido, morangos frescos fatiados e leite condensado.",
			price: transformPriceToDatabase(45.9),
			category: "Pizzas Doces",
			tags: [TagType.PIZZA, TagType.DESSERT, TagType.FRUIT]
		},
		{
			name: "Pizza Romeu e Julieta",
			description:
				"Queijo mussarela com goiabada cremosa e toque de canela.",
			price: transformPriceToDatabase(42.9),
			category: "Pizzas Doces",
			tags: [TagType.PIZZA, TagType.DESSERT]
		},
		{
			name: "Calzone de Frango com Catupiry",
			description:
				"Massa recheada com frango desfiado, catupiry cremoso, milho e azeitonas.",
			price: transformPriceToDatabase(39.9),
			category: "Calzones",
			tags: [TagType.FOOD, TagType.DINNER, TagType.MEAT]
		},
		{
			name: "Bruschetta Italiana",
			description:
				"Pão italiano grelhado com tomate, manjericão, alho e azeite extra virgem (4 unidades).",
			price: transformPriceToDatabase(24.9),
			category: "Entradas",
			tags: [TagType.APPETIZER, TagType.SIDE, TagType.VEGETARIAN]
		},
		{
			name: "Coca Cola 2L",
			description: "Refrigerante Coca-Cola gelado de 2 litros.",
			price: transformPriceToDatabase(14),
			category: "Bebidas",
			tags: [TagType.SODA, TagType.COLD_DRINK, TagType.NON_ALCOHOLIC_DRINK]
		},
		{
			name: "Vinho Tinto Chileno 750ml",
			description:
				"Vinho Cabernet Sauvignon chileno, garrafa de 750ml, harmoniza bem com pizzas.",
			price: transformPriceToDatabase(79.9),
			category: "Bebidas",
			tags: [TagType.ALCOHOLIC_DRINK, TagType.DRINK]
		},
		{
			name: "Água Mineral sem Gás 500ml",
			description: "Água mineral natural sem gás em garrafa de 500ml.",
			price: transformPriceToDatabase(4),
			category: "Bebidas",
			tags: [TagType.COLD_DRINK, TagType.NON_ALCOHOLIC_DRINK]
		}
	],
	addonCategories: [
		{
			name: "Bordas Recheadas",
			type: AddonType.MULTIPLE_CHOICE,
			addons: [
				{ name: "Sem borda recheada", price: 0 },
				{ name: "Catupiry", price: transformPriceToDatabase(8) },
				{ name: "Cheddar", price: transformPriceToDatabase(8) },
				{ name: "Chocolate", price: transformPriceToDatabase(9) }
			]
		},
		{
			name: "Adicionais",
			type: AddonType.QUANTITY,
			max_quantity: 5,
			addons: [
				{ name: "Mussarela extra", price: transformPriceToDatabase(5) },
				{ name: "Calabresa extra", price: transformPriceToDatabase(6) },
				{ name: "Bacon", price: transformPriceToDatabase(6) },
				{ name: "Azeitona preta", price: transformPriceToDatabase(3) },
				{ name: "Tomate seco", price: transformPriceToDatabase(5) }
			]
		},
		{
			name: "Tamanho",
			type: AddonType.MULTIPLE_CHOICE,
			addons: [
				{ name: "Média (6 fatias)", price: 0 },
				{ name: "Grande (8 fatias)", price: transformPriceToDatabase(10) },
				{ name: "Família (12 fatias)", price: transformPriceToDatabase(20) }
			]
		}
	],
	productTags: {},
	tagCombinations: [
		{
			from: TagType.PIZZA,
			to: [TagType.COLD_DRINK, TagType.SIDE, TagType.ALCOHOLIC_DRINK]
		},
		{ from: TagType.APPETIZER, to: [TagType.ALCOHOLIC_DRINK, TagType.SIDE] },
		{ from: TagType.DESSERT, to: [TagType.COFFEE, TagType.HOT_DRINK] }
	],
	districts: [
		{ name: "Aldeota", shipping_cost: transformPriceToDatabase(6) },
		{ name: "Meireles", shipping_cost: transformPriceToDatabase(7) },
		{ name: "Cocó", shipping_cost: transformPriceToDatabase(9) },
		{ name: "Dionísio Torres", shipping_cost: transformPriceToDatabase(6) },
		{ name: "Varjota", shipping_cost: transformPriceToDatabase(8) }
	],
	coupons: [
		{
			code: "BELLA15",
			type: CouponType.ORDER,
			discount_type: DiscountType.PERCENTAGE,
			value: 15
		},
		{
			code: "PIZZA20",
			type: CouponType.ORDER,
			discount_type: DiscountType.FIXED,
			value: transformPriceToDatabase(20)
		}
	],
	banners: [
		{ name: "Especial Parma", product_name: "Pizza Parma" },
		{ name: "Clássica Margherita", product_name: "Pizza Margherita" }
	],
	openingHours: standardWeekHours("18:00", "23:30"),
	socialLinks: [
		{
			platform: SocialPlatform.INSTAGRAM,
			url: "https://instagram.com/bellanapolifortaleza"
		},
		{
			platform: SocialPlatform.FACEBOOK,
			url: "https://facebook.com/bellanapolifortaleza"
		},
		{
			platform: SocialPlatform.WHATSAPP,
			url: "https://wa.me/5585987654321"
		}
	]
};

const churrascariaBoiGordo: EstablishmentSeed = {
	name: "Churrascaria Boi Gordo",
	slug: "churrascaria-boi-gordo",
	description:
		"Churrascaria tradicional gaúcha com cortes nobres grelhados na brasa, acompanhamentos caseiros e atendimento familiar há mais de 20 anos.",
	email: "reservas@churrascariaboigordo.com.br",
	cnpj: "34.567.890/0001-73",
	accepts_credit_card: true,
	only_delivery: false,
	ownerEmail: "jose@churrascariaboigordo.com.br",
	ownerName: "José Augusto",
	ownerPhone: "85992233445",
	address: {
		street: "Avenida Washington Soares",
		number: "4820",
		neighborhood: "Edson Queiroz",
		city: "Fortaleza",
		state: "CE",
		postal_code: "60811341",
		phone: "85991234567"
	},
	categories: [
		{ name: "Cortes Bovinos", order: 1 },
		{ name: "Cortes Suínos", order: 2 },
		{ name: "Aves", order: 3 },
		{ name: "Acompanhamentos", order: 4 },
		{ name: "Saladas", order: 5 },
		{ name: "Bebidas", order: 6 }
	],
	products: [
		{
			name: "Picanha Grelhada 400g",
			description:
				"Picanha bovina selecionada, grelhada na brasa no ponto da sua preferência, servida com farofa e vinagrete.",
			price: transformPriceToDatabase(99.9),
			category: "Cortes Bovinos",
			tags: [TagType.MEAT, TagType.GRILL, TagType.FOOD, TagType.DINNER]
		},
		{
			name: "Maminha 350g",
			description:
				"Maminha suculenta assada lentamente na brasa, acompanha pão de alho e molho chimichurri.",
			price: transformPriceToDatabase(79.9),
			category: "Cortes Bovinos",
			tags: [TagType.MEAT, TagType.GRILL, TagType.FOOD, TagType.DINNER]
		},
		{
			name: "Fraldinha 400g",
			description:
				"Fraldinha temperada com sal grosso, grelhada na brasa, acompanha mandioca cozida.",
			price: transformPriceToDatabase(74.9),
			category: "Cortes Bovinos",
			tags: [TagType.MEAT, TagType.GRILL, TagType.FOOD]
		},
		{
			name: "Costela Bovina 600g",
			description:
				"Costela bovina assada por 12 horas em fogo baixo, macia e desfiando na garfada.",
			price: transformPriceToDatabase(119.9),
			category: "Cortes Bovinos",
			tags: [TagType.MEAT, TagType.GRILL, TagType.DINNER]
		},
		{
			name: "Linguiça Toscana 300g",
			description:
				"Linguiça artesanal toscana grelhada na brasa, servida com pão francês e molho de pimenta.",
			price: transformPriceToDatabase(39.9),
			category: "Cortes Suínos",
			tags: [TagType.MEAT, TagType.GRILL, TagType.APPETIZER]
		},
		{
			name: "Costelinha Suína BBQ 500g",
			description:
				"Costelinha suína defumada com molho barbecue da casa e batata rústica.",
			price: transformPriceToDatabase(69.9),
			category: "Cortes Suínos",
			tags: [TagType.MEAT, TagType.GRILL, TagType.DINNER]
		},
		{
			name: "Frango a Passarinho 400g",
			description:
				"Cubos de frango marinados no alho e limão, fritos crocantes, servidos com molho tártaro.",
			price: transformPriceToDatabase(44.9),
			category: "Aves",
			tags: [TagType.MEAT, TagType.APPETIZER, TagType.FOOD]
		},
		{
			name: "Coração de Galinha 250g",
			description:
				"Coração de galinha grelhado no espeto com sal grosso, iguaria clássica da churrascaria.",
			price: transformPriceToDatabase(34.9),
			category: "Aves",
			tags: [TagType.MEAT, TagType.GRILL, TagType.APPETIZER]
		},
		{
			name: "Farofa Especial da Casa",
			description:
				"Farofa crocante com bacon, ovos, cebola caramelizada e uva passa.",
			price: transformPriceToDatabase(18.9),
			category: "Acompanhamentos",
			tags: [TagType.SIDE, TagType.FOOD]
		},
		{
			name: "Arroz Branco",
			description: "Arroz branco soltinho temperado com alho e sal.",
			price: transformPriceToDatabase(12.9),
			category: "Acompanhamentos",
			tags: [TagType.SIDE, TagType.FOOD]
		},
		{
			name: "Feijão Tropeiro",
			description:
				"Feijão com bacon, linguiça calabresa, couve refogada, farinha de mandioca e ovos.",
			price: transformPriceToDatabase(22.9),
			category: "Acompanhamentos",
			tags: [TagType.SIDE, TagType.FOOD, TagType.MEAT]
		},
		{
			name: "Mandioca Frita",
			description:
				"Mandioca cozida e frita até ficar crocante por fora e macia por dentro.",
			price: transformPriceToDatabase(19.9),
			category: "Acompanhamentos",
			tags: [TagType.SIDE, TagType.VEGETABLE, TagType.VEGETARIAN]
		},
		{
			name: "Salada Tropical",
			description:
				"Alface, rúcula, tomate cereja, manga, nozes e molho de mostarda e mel.",
			price: transformPriceToDatabase(26.9),
			category: "Saladas",
			tags: [TagType.SALAD, TagType.VEGETABLE, TagType.VEGETARIAN]
		},
		{
			name: "Salada Caprese",
			description:
				"Tomates maduros, mussarela de búfala e manjericão fresco com azeite extra virgem.",
			price: transformPriceToDatabase(29.9),
			category: "Saladas",
			tags: [TagType.SALAD, TagType.VEGETARIAN, TagType.APPETIZER]
		},
		{
			name: "Guaraná Antarctica 2L",
			description: "Refrigerante Guaraná Antarctica em garrafa de 2 litros.",
			price: transformPriceToDatabase(13),
			category: "Bebidas",
			tags: [TagType.SODA, TagType.COLD_DRINK, TagType.NON_ALCOHOLIC_DRINK]
		},
		{
			name: "Cerveja Heineken Long Neck 330ml",
			description: "Cerveja Heineken lager premium em long neck gelado.",
			price: transformPriceToDatabase(11),
			category: "Bebidas",
			tags: [TagType.ALCOHOLIC_DRINK, TagType.COLD_DRINK]
		},
		{
			name: "Caipirinha de Limão",
			description:
				"Caipirinha tradicional com cachaça artesanal, limão taiti, açúcar e gelo.",
			price: transformPriceToDatabase(18),
			category: "Bebidas",
			tags: [TagType.ALCOHOLIC_DRINK, TagType.COLD_DRINK]
		}
	],
	addonCategories: [
		{
			name: "Ponto da Carne",
			type: AddonType.MULTIPLE_CHOICE,
			addons: [
				{ name: "Mal passada", price: 0 },
				{ name: "Ao ponto para mal", price: 0 },
				{ name: "Ao ponto", price: 0 },
				{ name: "Ao ponto para bem", price: 0 },
				{ name: "Bem passada", price: 0 }
			]
		},
		{
			name: "Molhos",
			type: AddonType.MULTIPLE_CHOICE,
			addons: [
				{ name: "Chimichurri", price: transformPriceToDatabase(3) },
				{ name: "Barbecue", price: transformPriceToDatabase(3) },
				{ name: "Vinagrete", price: transformPriceToDatabase(2.5) },
				{ name: "Molho da casa", price: transformPriceToDatabase(3) }
			]
		},
		{
			name: "Porções Extras",
			type: AddonType.QUANTITY,
			max_quantity: 4,
			addons: [
				{ name: "Pão de alho", price: transformPriceToDatabase(8) },
				{ name: "Farofa extra", price: transformPriceToDatabase(6) },
				{ name: "Vinagrete", price: transformPriceToDatabase(5) }
			]
		}
	],
	productTags: {},
	tagCombinations: [
		{
			from: TagType.MEAT,
			to: [TagType.SIDE, TagType.SALAD, TagType.ALCOHOLIC_DRINK]
		},
		{ from: TagType.GRILL, to: [TagType.SIDE, TagType.SALAD, TagType.DRINK] },
		{ from: TagType.APPETIZER, to: [TagType.ALCOHOLIC_DRINK] }
	],
	districts: [
		{ name: "Edson Queiroz", shipping_cost: transformPriceToDatabase(7) },
		{ name: "Água Fria", shipping_cost: transformPriceToDatabase(9) },
		{ name: "Sapiranga", shipping_cost: transformPriceToDatabase(10) },
		{ name: "Messejana", shipping_cost: transformPriceToDatabase(12) }
	],
	coupons: [
		{
			code: "BOIGORDO10",
			type: CouponType.ORDER,
			discount_type: DiscountType.PERCENTAGE,
			value: 10
		},
		{
			code: "PICANHAFREE",
			type: CouponType.SHIPPING,
			discount_type: DiscountType.PERCENTAGE,
			value: 100
		}
	],
	banners: [
		{ name: "Picanha na Brasa", product_name: "Picanha Grelhada 400g" },
		{ name: "Costela 12 Horas", product_name: "Costela Bovina 600g" }
	],
	openingHours: standardWeekHours("11:00", "23:00"),
	socialLinks: [
		{
			platform: SocialPlatform.INSTAGRAM,
			url: "https://instagram.com/churrascariaboigordo"
		},
		{
			platform: SocialPlatform.WHATSAPP,
			url: "https://wa.me/5585991234567"
		}
	]
};

const sushiRyu: EstablishmentSeed = {
	name: "Sushi Ryu",
	slug: "sushi-ryu",
	description:
		"Culinária japonesa contemporânea com peixes frescos do dia, combinados premium, hot rolls e temakis preparados por sushiman experiente.",
	email: "contato@sushiryu.com.br",
	cnpj: "45.678.901/0001-64",
	accepts_credit_card: true,
	only_delivery: true,
	ownerEmail: "takeshi@sushiryu.com.br",
	ownerName: "Takeshi Nakamura",
	ownerPhone: "85993344556",
	address: {
		street: "Rua Ana Bilhar",
		number: "998",
		neighborhood: "Varjota",
		city: "Fortaleza",
		state: "CE",
		postal_code: "60165090",
		phone: "85992223344"
	},
	categories: [
		{ name: "Combinados", order: 1 },
		{ name: "Sashimis", order: 2 },
		{ name: "Niguiris", order: 3 },
		{ name: "Hot Rolls", order: 4 },
		{ name: "Temakis", order: 5 },
		{ name: "Pratos Quentes", order: 6 },
		{ name: "Bebidas", order: 7 }
	],
	products: [
		{
			name: "Combinado Ryu 30 peças",
			description:
				"Seleção especial do sushiman com 8 niguiris, 10 sashimis, 6 uramakis e 6 hot rolls.",
			price: transformPriceToDatabase(129.9),
			category: "Combinados",
			tags: [TagType.SUSHI, TagType.FISH, TagType.FOOD, TagType.DINNER]
		},
		{
			name: "Combinado Tradicional 20 peças",
			description:
				"10 sashimis de salmão, 6 niguiris e 4 uramakis de pepino com salmão.",
			price: transformPriceToDatabase(89.9),
			category: "Combinados",
			tags: [TagType.SUSHI, TagType.FISH, TagType.FOOD, TagType.DINNER]
		},
		{
			name: "Sashimi de Salmão 10 fatias",
			description:
				"Fatias finas e frescas de salmão noruego servidas com molho shoyu e wasabi.",
			price: transformPriceToDatabase(58.9),
			category: "Sashimis",
			tags: [TagType.SUSHI, TagType.FISH, TagType.GLUTEN_FREE]
		},
		{
			name: "Sashimi de Atum 10 fatias",
			description:
				"Atum fresco cortado em fatias delicadas servido com shoyu, gengibre e wasabi.",
			price: transformPriceToDatabase(68.9),
			category: "Sashimis",
			tags: [TagType.SUSHI, TagType.FISH, TagType.GLUTEN_FREE]
		},
		{
			name: "Niguiri de Salmão (2 unidades)",
			description: "Bolinho de arroz shari coberto com fatia de salmão fresco.",
			price: transformPriceToDatabase(18.9),
			category: "Niguiris",
			tags: [TagType.SUSHI, TagType.FISH]
		},
		{
			name: "Niguiri de Camarão (2 unidades)",
			description: "Arroz shari com camarão cozido e fio de molho tarê.",
			price: transformPriceToDatabase(22.9),
			category: "Niguiris",
			tags: [TagType.SUSHI, TagType.FISH]
		},
		{
			name: "Hot Philadelphia (8 unidades)",
			description:
				"Uramaki empanado e frito com salmão, cream cheese e cebolinha, coberto com molho tarê.",
			price: transformPriceToDatabase(49.9),
			category: "Hot Rolls",
			tags: [TagType.SUSHI, TagType.FISH, TagType.FOOD]
		},
		{
			name: "Hot Spicy Tuna (8 unidades)",
			description:
				"Uramaki empanado com atum, maionese japonesa apimentada e cebolinha.",
			price: transformPriceToDatabase(54.9),
			category: "Hot Rolls",
			tags: [TagType.SUSHI, TagType.FISH]
		},
		{
			name: "Temaki Salmão Filadélfia",
			description:
				"Cone de alga nori recheado com arroz, salmão fresco e cream cheese.",
			price: transformPriceToDatabase(32.9),
			category: "Temakis",
			tags: [TagType.SUSHI, TagType.FISH]
		},
		{
			name: "Temaki Atum Picante",
			description:
				"Temaki com atum, maionese japonesa apimentada, cebolinha e gergelim.",
			price: transformPriceToDatabase(36.9),
			category: "Temakis",
			tags: [TagType.SUSHI, TagType.FISH]
		},
		{
			name: "Yakisoba de Frango",
			description:
				"Macarrão oriental salteado com frango, brócolis, cenoura, pimentão e molho shoyu.",
			price: transformPriceToDatabase(42.9),
			category: "Pratos Quentes",
			tags: [TagType.FOOD, TagType.PASTA, TagType.MEAT, TagType.DINNER]
		},
		{
			name: "Gyoza (6 unidades)",
			description:
				"Pastéis japoneses fritos recheados com carne suína e legumes, acompanha molho shoyu.",
			price: transformPriceToDatabase(29.9),
			category: "Pratos Quentes",
			tags: [TagType.APPETIZER, TagType.MEAT, TagType.SIDE]
		},
		{
			name: "Edamame",
			description: "Vagens de soja cozidas com sal grosso japonês.",
			price: transformPriceToDatabase(19.9),
			category: "Pratos Quentes",
			tags: [TagType.APPETIZER, TagType.VEGAN, TagType.VEGETARIAN]
		},
		{
			name: "Chá Verde Gelado 500ml",
			description: "Chá verde japonês gelado, sem açúcar.",
			price: transformPriceToDatabase(9),
			category: "Bebidas",
			tags: [TagType.TEA, TagType.COLD_DRINK, TagType.NON_ALCOHOLIC_DRINK]
		},
		{
			name: "Saquê Quente 200ml",
			description: "Saquê tradicional servido aquecido em tokkuri de cerâmica.",
			price: transformPriceToDatabase(28),
			category: "Bebidas",
			tags: [TagType.ALCOHOLIC_DRINK, TagType.HOT_DRINK]
		},
		{
			name: "Cerveja Sapporo 330ml",
			description: "Cerveja lager japonesa premium gelada.",
			price: transformPriceToDatabase(18),
			category: "Bebidas",
			tags: [TagType.ALCOHOLIC_DRINK, TagType.COLD_DRINK]
		}
	],
	addonCategories: [
		{
			name: "Molhos",
			type: AddonType.MULTIPLE_CHOICE,
			addons: [
				{ name: "Shoyu tradicional", price: 0 },
				{ name: "Shoyu com limón (ponzu)", price: transformPriceToDatabase(2) },
				{ name: "Tarê", price: transformPriceToDatabase(2) },
				{
					name: "Maionese japonesa picante",
					price: transformPriceToDatabase(3)
				}
			]
		},
		{
			name: "Complementos",
			type: AddonType.QUANTITY,
			max_quantity: 4,
			addons: [
				{ name: "Wasabi extra", price: transformPriceToDatabase(2) },
				{ name: "Gengibre em conserva (gari)", price: transformPriceToDatabase(3) },
				{ name: "Hashi descartável", price: 0 }
			]
		}
	],
	productTags: {},
	tagCombinations: [
		{
			from: TagType.SUSHI,
			to: [TagType.SIDE, TagType.TEA, TagType.ALCOHOLIC_DRINK]
		},
		{ from: TagType.FISH, to: [TagType.SIDE, TagType.SALAD] },
		{ from: TagType.APPETIZER, to: [TagType.ALCOHOLIC_DRINK, TagType.TEA] }
	],
	districts: [
		{ name: "Varjota", shipping_cost: transformPriceToDatabase(5) },
		{ name: "Aldeota", shipping_cost: transformPriceToDatabase(7) },
		{ name: "Meireles", shipping_cost: transformPriceToDatabase(7) },
		{ name: "Mucuripe", shipping_cost: transformPriceToDatabase(8) },
		{ name: "Cocó", shipping_cost: transformPriceToDatabase(10) }
	],
	coupons: [
		{
			code: "RYUBEMVINDO",
			type: CouponType.ORDER,
			discount_type: DiscountType.PERCENTAGE,
			value: 12
		},
		{
			code: "FRETERYU",
			type: CouponType.SHIPPING,
			discount_type: DiscountType.FIXED,
			value: transformPriceToDatabase(5)
		}
	],
	banners: [
		{ name: "Combinado Ryu", product_name: "Combinado Ryu 30 peças" },
		{ name: "Hot Philadelphia", product_name: "Hot Philadelphia (8 unidades)" }
	],
	openingHours: standardWeekHours("18:00", "23:30", [WeekDay.MONDAY]),
	socialLinks: [
		{
			platform: SocialPlatform.INSTAGRAM,
			url: "https://instagram.com/sushiryu"
		},
		{
			platform: SocialPlatform.WHATSAPP,
			url: "https://wa.me/5585992223344"
		}
	]
};

const establishmentsSeed: EstablishmentSeed[] = [
	milkShakeMix,
	pizzariaBellaNapoli,
	churrascariaBoiGordo,
	sushiRyu
];

async function seedEstablishment(seed: EstablishmentSeed, establishmentOwnerRoleId: number) {
	const owner = await prisma.user.create({
		data: {
			name: seed.ownerName,
			email: seed.ownerEmail,
			password: await hash("owner123", Constants.HASH_SALT_LENGTH),
			role_id: establishmentOwnerRoleId
		}
	});

	const establishment = await prisma.establishment.create({
		data: {
			name: seed.name,
			slug: seed.slug,
			description: seed.description,
			email: seed.email,
			cnpj: seed.cnpj,
			accepts_credit_card: seed.accepts_credit_card,
			only_delivery: seed.only_delivery,
			next_billing_date: new Date("2030-06-12T12:06:24"),
			owner_id: owner.id
		}
	});

	const address = await prisma.address.create({
		data: {
			street: seed.address.street,
			number: seed.address.number,
			neighborhood: seed.address.neighborhood,
			city: seed.address.city,
			state: seed.address.state,
			postal_code: seed.address.postal_code,
			phone: seed.address.phone
		}
	});

	await prisma.establishmentAddress.create({
		data: {
			establishment_id: establishment.id,
			address_id: address.id
		}
	});

	const categories = await prisma.productCategory.createManyAndReturn({
		data: seed.categories.map(c => ({
			name: c.name,
			slug: slugify(c.name),
			order: c.order,
			establishment_id: establishment.id
		}))
	});

	const categoryByName = new Map(categories.map(c => [c.name, c]));

	const products = await prisma.product.createManyAndReturn({
		data: seed.products.map(p => {
			const category = categoryByName.get(p.category);
			if (!category) {
				throw new Error(
					`Categoria "${p.category}" não encontrada para o produto "${p.name}" em ${seed.name}`
				);
			}
			return {
				name: p.name,
				slug: slugify(p.name),
				description: p.description,
				price: p.price,
				discount_percentage: p.discount_percentage,
				establishment_id: establishment.id,
				category_id: category.id
			};
		})
	});

	const productByName = new Map(products.map(p => [p.name, p]));

	for (const addonCategorySeed of seed.addonCategories) {
		const addonCategory = await prisma.addonCategory.create({
			data: {
				name: addonCategorySeed.name,
				type: addonCategorySeed.type,
				max_quantity: addonCategorySeed.max_quantity,
				establishment_id: establishment.id
			}
		});

		await prisma.addon.createMany({
			data: addonCategorySeed.addons.map(a => ({
				name: a.name,
				price: a.price,
				category_id: addonCategory.id
			}))
		});
	}

	const tags = await prisma.tag.createManyAndReturn({
		data: Object.values(TagType).map(tag => ({
			type: tag,
			label: tagLabel[tag],
			establishment_id: establishment.id
		}))
	});

	const tagByType = new Map(tags.map(t => [t.type, t]));

	const productTagsData = seed.products.flatMap(p => {
		const product = productByName.get(p.name);
		if (!product) return [];
		return p.tags.map(t => ({
			product_id: product.id,
			tag_id: tagByType.get(t)!.id
		}));
	});

	if (productTagsData.length > 0) {
		await prisma.productTag.createMany({ data: productTagsData });
	}

	const tagCombinationsData: { from_tag_id: number; to_tag_id: number }[] = [];
	for (const combo of seed.tagCombinations) {
		for (const to of combo.to) {
			const fromTag = tagByType.get(combo.from);
			const toTag = tagByType.get(to);
			if (!fromTag || !toTag) continue;
			tagCombinationsData.push({
				from_tag_id: fromTag.id,
				to_tag_id: toTag.id
			});
			tagCombinationsData.push({
				from_tag_id: toTag.id,
				to_tag_id: fromTag.id
			});
		}
	}

	if (tagCombinationsData.length > 0) {
		await prisma.tagCombination.createMany({
			data: tagCombinationsData,
			skipDuplicates: true
		});
	}

	await prisma.district.createMany({
		data: seed.districts.map(d => ({
			name: d.name,
			shipping_cost: d.shipping_cost,
			establishment_id: establishment.id
		}))
	});

	await prisma.coupon.createMany({
		data: seed.coupons.map(c => ({
			code: c.code,
			type: c.type,
			discount_type: c.discount_type,
			value: c.value,
			establishment_id: establishment.id
		}))
	});

	for (const banner of seed.banners) {
		const product = productByName.get(banner.product_name);
		if (!product) continue;
		await prisma.banner.create({
			data: {
				name: banner.name,
				link_type: BannerLinkType.PRODUCT,
				product_id: product.id,
				establishment_id: establishment.id
			}
		});
	}

	await prisma.openingHour.createMany({
		data: seed.openingHours.map(h => ({
			day_of_week: h.day_of_week,
			opens_at: h.opens_at,
			closes_at: h.closes_at,
			is_closed: h.is_closed,
			establishment_id: establishment.id
		}))
	});

	await prisma.socialLink.createMany({
		data: seed.socialLinks.map(s => ({
			platform: s.platform,
			url: s.url,
			establishment_id: establishment.id
		}))
	});

	// Create menu for the establishment
	const { makeCreateMenuForNewEstablishmentService } = await import(
		"@/factories/services/menu/make-create-menu-for-new-establishment-service.js"
	);
	const createMenuForEstablishmentService = makeCreateMenuForNewEstablishmentService();
	await createMenuForEstablishmentService.handle({
		establishmentId: establishment.id
	});

	console.log(`  ✓ ${seed.name} (${seed.ownerName})`);
}

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
		PermissionType.VIEW_CUSTOMERS,
		PermissionType.VIEW_DASHBOARD
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
					create: [
						PermissionType.VIEW_CATALOG,
						PermissionType.ADD_TO_CART,
						PermissionType.MANAGE_OWN_ADDRESSES,
						PermissionType.MANAGE_OWN_ORDERS
					].map(name => ({ permission: { connect: { name } } }))
				}
			}
		})
	]);

	const adminRole = roles.find(r => r.name === RoleType.ADMIN)!;
	const establishmentOwnerRole = roles.find(r => r.name === RoleType.ESTABLISHMENT_OWNER)!;

	// ----- Admin user -----
	await prisma.user.create({
		data: {
			name: "Admin",
			email: "admin@delivery.com",
			password: await hash("admin123", Constants.HASH_SALT_LENGTH),
			role_id: adminRole.id
		}
	});

	// ----- Establishments with owners -----
	console.log("📦 Criando estabelecimentos...");
	for (const seed of establishmentsSeed) {
		await seedEstablishment(seed, establishmentOwnerRole.id);
	}

	// ----- Resource Rules & File Formats -----
	const resourceRules = await prisma.resourceRule.createManyAndReturn({
		data: [
			{ type: "BANNER", for: "PRODUCT", width: 1920, height: 1080 },
			{ type: "THUMBNAIL", for: "PRODUCT", width: 320, height: 320 },
			{ type: "LOGO", for: "ESTABLISHMENT", width: 200, height: 200 },
			{ type: "BANNER", for: "ESTABLISHMENT", width: 1920, height: 1080 },
			{ type: "THUMBNAIL", for: "CATEGORY", width: 320, height: 320 },
			{ type: "BANNER", for: "BANNER", width: 1920, height: 1080 }
		]
	});

	const fileFormats: FileFormatType[] = [
		FileFormatType.JPG,
		FileFormatType.JPEG,
		FileFormatType.PNG
	];

	await prisma.fileFormat.createMany({
		data: resourceRules.flatMap(rule =>
			fileFormats.map(type => ({
				type,
				resource_rule_id: rule.id
			}))
		)
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