import { mapObjectResourcesList } from "@/helpers/resource.js";
import type {
  ProductCategoryFromRepository,
  ProductCategoryList,
} from "@/types/product-category.js";

export const mapProductCategory = (
  productCategory: ProductCategoryFromRepository,
): ProductCategoryList => ({
  ...productCategory,
  resources: mapObjectResourcesList(productCategory.resources),
});

export const mapProductCategories = (
  productCategories: ProductCategoryFromRepository[],
): ProductCategoryList[] => productCategories.map(mapProductCategory);
