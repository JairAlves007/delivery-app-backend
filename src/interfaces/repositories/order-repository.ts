import type { Prisma } from "@/generated/prisma/client.js";
import type { OrderFromRepository } from "@/types/order.js";

import type { ICRUDBase } from "../crud-base.js";
import type { CursorPagination } from "../cursor-pagination.js";

export type CreateOrderRepositoryOptions = {
  stockDecrements?: Array<{ productId: string; quantity: number }>;
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
  ): Promise<{ id: string }>;
}
