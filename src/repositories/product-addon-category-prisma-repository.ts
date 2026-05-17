import type { Prisma } from "@/generated/prisma/client.js";
import type { IProductAddonCategoryRepository } from "@/interfaces/repositories/product-addon-category-repository.js";
import prisma from "@/lib/prisma.js";
import type {
  ProductAddonCategoryFromRepository,
  ProductAddonCategoryWithProductFromRepository,
} from "@/types/product-addon-category.js";

export class ProductAddonCategoryPrismaRepository
  implements IProductAddonCategoryRepository
{
  async listByProductId(
    productId: string,
  ): Promise<ProductAddonCategoryFromRepository[]> {
    return await prisma.productAddonCategory.findMany({
      where: {
        product_id: productId,
        addonCategory: {
          deleted_at: null,
        },
      },
      include: {
        addonCategory: {
          include: {
            addons: {
              where: {
                deleted_at: null,
              },
              orderBy: {
                name: "asc",
              },
            },
          },
        },
      },
      orderBy: {
        display_order: "asc",
      },
    });
  }

  async findByProductAndCategory({
    productId,
    addonCategoryId,
  }: {
    productId: string;
    addonCategoryId: number;
  }): Promise<ProductAddonCategoryWithProductFromRepository | null> {
    return await prisma.productAddonCategory.findUnique({
      where: {
        product_id_addon_category_id: {
          product_id: productId,
          addon_category_id: addonCategoryId,
        },
      },
      include: {
        product: true,
        addonCategory: {
          include: {
            addons: {
              where: {
                deleted_at: null,
              },
            },
          },
        },
      },
    });
  }

  async findRequiredByProductId(productId: string): Promise<
    Array<{
      addon_category_id: number;
      min_selection: number | null;
    }>
  > {
    return await prisma.productAddonCategory.findMany({
      where: {
        product_id: productId,
        is_required: true,
        addonCategory: {
          deleted_at: null,
        },
      },
      select: {
        addon_category_id: true,
        min_selection: true,
      },
    });
  }

  async attach(
    data: Prisma.ProductAddonCategoryUncheckedCreateInput,
  ): Promise<void> {
    await prisma.productAddonCategory.create({ data });
  }

  async update({
    id,
    data,
  }: {
    id: number;
    data: Prisma.ProductAddonCategoryUpdateInput;
  }): Promise<void> {
    await prisma.productAddonCategory.update({
      where: { id },
      data,
    });
  }

  async detach({
    productId,
    addonCategoryId,
  }: {
    productId: string;
    addonCategoryId: number;
  }): Promise<void> {
    await prisma.productAddonCategory.delete({
      where: {
        product_id_addon_category_id: {
          product_id: productId,
          addon_category_id: addonCategoryId,
        },
      },
    });
  }
}
