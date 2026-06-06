import {
  DiscountType,
  ProductPricingMode,
  ResourceType,
} from "@/generated/prisma/client.js";
import Constants from "@/helpers/constants.js";
import { formatPhoneForDisplay } from "@/helpers/phone.js";
import {
  getValueDiscounted,
  transformPriceFromDatabase,
  transformPriceToHumanReadable,
} from "@/helpers/price.js";
import { mapObjectResourcesList } from "@/helpers/resource.js";
import type { EstablishmentThemePayload } from "@/services/establishment-theme/map-establishment-theme.js";
import type {
  DigitalMenuCategory,
  DigitalMenuProduct,
  DigitalMenuRenderData,
  DigitalMenuRenderSource,
} from "@/types/digital-menu.js";

const formatCents = (cents: number): string =>
  transformPriceToHumanReadable(transformPriceFromDatabase(cents));

const mapProduct = (
  product: DigitalMenuRenderSource["categories"][number]["products"][number],
): DigitalMenuProduct => {
  const productResources = mapObjectResourcesList(product.resources);
  const isPerWeight = product.pricing_mode === ProductPricingMode.PER_WEIGHT;
  const baseCents = isPerWeight
    ? (product.price_per_100g ?? product.price)
    : product.price;
  const discount = getValueDiscounted(
    DiscountType.PERCENTAGE,
    product.discount_percentage ?? 0,
    baseCents,
  );
  const finalCents = baseCents - discount;
  const suffix = isPerWeight ? " /100g" : "";

  return {
    name: product.name,
    description: product.description,
    priceLabel: `${formatCents(finalCents)}${suffix}`,
    originalPriceLabel:
      discount > 0 ? `${formatCents(baseCents)}${suffix}` : null,
    isPerWeight,
    imageUrl:
      productResources[ResourceType.THUMBNAIL]?.path ??
      productResources[ResourceType.BANNER]?.path ??
      null,
  };
};

const buildAddressLine = (
  source: DigitalMenuRenderSource,
): { addressLine: string | null; phone: string | null } => {
  const address = source.address?.address;
  if (!address) return { addressLine: null, phone: null };

  const parts = [
    `${address.street}, ${address.number}`,
    address.neighborhood,
    `${address.city} - ${address.state}`,
  ].filter(Boolean);

  return {
    addressLine: parts.join(" · "),
    phone: address.phone ? formatPhoneForDisplay(address.phone) : null,
  };
};

export const mapDigitalMenuRenderData = (params: {
  source: DigitalMenuRenderSource;
  theme: EstablishmentThemePayload;
}): DigitalMenuRenderData => {
  const { source, theme } = params;
  const resources = mapObjectResourcesList(source.resources);
  const { addressLine, phone } = buildAddressLine(source);

  const categories: DigitalMenuCategory[] = source.categories
    .filter((category) => category.products.length > 0)
    .map((category) => {
      const categoryResources = mapObjectResourcesList(category.resources);

      return {
        name: category.name,
        bannerUrl:
          categoryResources[ResourceType.BANNER]?.path ??
          categoryResources[ResourceType.THUMBNAIL]?.path ??
          null,
        products: category.products.map(mapProduct),
      };
    });

  const generatedAtLabel = new Date().toLocaleDateString("pt-BR", {
    timeZone: Constants.DASHBOARD_TIMEZONE,
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return {
    establishment: {
      name: source.name,
      description: source.description,
      addressLine,
      phone,
      logoUrl: resources[ResourceType.LOGO]?.path ?? null,
      bannerUrl: resources[ResourceType.BANNER]?.path ?? null,
    },
    colors: {
      primary: theme.colors.primary,
      secondary: theme.colors.secondary,
      background: theme.colors.background,
      foreground: theme.colors.foreground,
      muted: theme.colors.muted,
      border: theme.colors.border,
    },
    categories,
    generatedAtLabel,
  };
};
