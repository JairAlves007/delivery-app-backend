import type {
  Prisma,
  ProductPricingMode,
} from "@/generated/prisma/client.js";
import type { FilterParams, PaginationParams } from "@/types/crud.js";
import type { OrderFromRepository, OrderListFilters } from "@/types/order.js";

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
      "create" | "listAll" | "count" | "paginate"
    >,
    CursorPagination<OrderFromRepository, string> {
  create(
    data: Prisma.OrderCreateInput,
    options?: CreateOrderRepositoryOptions,
  ): Promise<CreateOrderRepositoryResult>;
  existsByIdempotencyKey(idempotencyKey: string): Promise<boolean>;
  listAll(
    filterParams?: FilterParams,
    orderFilters?: OrderListFilters,
  ): Promise<OrderFromRepository[]>;
  count(
    filterParams?: FilterParams,
    orderFilters?: OrderListFilters,
  ): Promise<number>;
  paginate(
    paginationParams: PaginationParams,
    orderFilters?: OrderListFilters,
  ): Promise<OrderFromRepository[]>;
}
