import { env } from "@/env.js";
import type { ComboWithRelations } from "@/types/combo.js";

type PriceTransformer = (value: number) => number;

const identity: PriceTransformer = (value) => value;

export const mapCombo = (
  combo: ComboWithRelations,
  transformPrice: PriceTransformer = identity,
) => ({
  id: combo.id,
  name: combo.name,
  slug: combo.slug,
  description: combo.description,
  combo_type: combo.combo_type,
  price: transformPrice(combo.price),
  discount_percentage: combo.discount_percentage,
  is_active: combo.is_active,
  valid_until: combo.valid_until,
  order: combo.order,
  image: combo.resources[0]
    ? `${env.PUBLIC_BUCKET_URL}/${combo.resources[0].resource.path}/${combo.resources[0].resource.file_key}`
    : null,
  items: combo.items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    product: {
      id: item.product.id,
      name: item.product.name,
      price: transformPrice(item.product.price),
    },
  })),
  groups: combo.groups
    .sort((a, b) => a.display_order - b.display_order)
    .map((group) => ({
      id: group.id,
      name: group.name,
      min_selection: group.min_selection,
      max_selection: group.max_selection,
      display_order: group.display_order,
      options: group.options.map((option) => ({
        id: option.id,
        additional_price: transformPrice(option.additional_price),
        product: {
          id: option.product.id,
          name: option.product.name,
          price: transformPrice(option.product.price),
        },
      })),
    })),
});
