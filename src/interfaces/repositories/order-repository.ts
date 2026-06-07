import type {
  Prisma,
  ProductPricingMode,
} from "@/generated/prisma/client.js";
import type { OrderFromRepository } from "@/types/order.js";

import type { ICRUDBase } from "../crud-base.js";
import type { CursorPagination } from "../cursor-pagination.js";

export type StockDecrement = {
  productId: string;
  quantity: number;
  prevStock: number;
  lowStockThreshold: number | null;
  productName: string;
  pricingMode: ProductPricingMode;
};

export type LowStockProduct = {
  id: string;
  name: string;
  stock: number;
  pricingMode: ProductPricingMode;
};

export type CreateOrderRepositoryOptions = {
  stockDecrements?: StockDecrement[];
};

export type CreateOrderRepositoryResult = {
  id: string;
  lowStockProducts: LowStockProduct[];
};

export interface IOrderRepository
  extends
    Omit<
      ICRUDBase<
        OrderFromRepository,
        Prisma.OrderCreateInput,
        Prisma.OrderUpdateInput,
        string
      >,
      "create"
    >,
    CursorPagination<OrderFromRepository, string> {
  create(
    data: Prisma.OrderCreateInput,
    options?: CreateOrderRepositoryOptions,
  ): Promise<CreateOrderRepositoryResult>;
}
