import { ProductOutOfStockError } from "@/errors/product/out-of-stock-error.js";
import type { Prisma } from "@/generated/prisma/client.js";
import Constants from "@/helpers/constants.js";
import { transformValidFilterParams } from "@/helpers/crud.js";
import type {
  CreateOrderRepositoryOptions,
  CreateOrderRepositoryResult,
  IOrderRepository,
  LowStockProduct,
} from "@/interfaces/repositories/order-repository.js";
import prisma from "@/lib/prisma.js";
import type {
  CursorPaginationParams,
  DeleteContentParams,
  FilterParams,
  FindByIdParams,
  PaginationParams,
  UpdateContentParams,
} from "@/types/crud.js";
import type { OrderFromRepository } from "@/types/order.js";

const orderInclude = {
  coupon: true,
  items: { include: { addons: true } },
  orderCoupon: true,
  orderDeliveryAddress: true,
  statuses: {
    select: { label: true, value: true },
    orderBy: { created_at: "desc" },
    take: 1,
  },
} satisfies Prisma.OrderInclude;

export class OrderPrismaRepository implements IOrderRepository {
  async listAll(filterParams?: FilterParams): Promise<OrderFromRepository[]> {
    const params = transformValidFilterParams(filterParams);

    return await prisma.order.findMany({
      where: {
        deleted_at: null,
        ...params,
      },
      take: Constants.MAX_LISTING_LIMIT,
      include: orderInclude,
      orderBy: {
        created_at: "desc",
      },
    });
  }

  async count(filterParams?: FilterParams): Promise<number> {
    const params = transformValidFilterParams(filterParams);

    return await prisma.order.count({
      where: {
        deleted_at: null,
        ...params,
      },
    });
  }

  async paginate({
    page,
    perPage,
    filterParams,
  }: PaginationParams): Promise<OrderFromRepository[]> {
    const params = transformValidFilterParams(filterParams);

    return await prisma.order.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
      where: {
        deleted_at: null,
        ...params,
      },
      include: orderInclude,
      orderBy: {
        created_at: "desc",
      },
    });
  }

  async cursorPaginate({
    limit,
    cursor,
    filterParams,
  }: CursorPaginationParams<string>): Promise<OrderFromRepository[]> {
    const params = transformValidFilterParams(filterParams);

    return await prisma.order.findMany({
      where: {
        deleted_at: null,
        ...params,
      },
      include: orderInclude,
      orderBy: {
        created_at: "desc",
      },
      take: limit + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
    });
  }

  async findById({
    id,
    filterParams,
  }: FindByIdParams<string>): Promise<OrderFromRepository | null> {
    const params = transformValidFilterParams(filterParams);

    return await prisma.order.findFirst({
      where: {
        id,
        deleted_at: null,
        ...params,
      },
      include: orderInclude,
    });
  }

  async create(
    data: Prisma.OrderCreateInput,
    options?: CreateOrderRepositoryOptions,
  ): Promise<CreateOrderRepositoryResult> {
    const stockDecrements = options?.stockDecrements ?? [];

    if (stockDecrements.length === 0) {
      const order = await prisma.order.create({
        data,
        select: { id: true },
      });

      return { id: order.id, lowStockProducts: [] };
    }

    return await prisma.$transaction(async (tx) => {
      const lowStockProducts: LowStockProduct[] = [];

      for (const decrement of stockDecrements) {
        const { count } = await tx.product.updateMany({
          where: {
            id: decrement.productId,
            deleted_at: null,
            stock: { gte: decrement.quantity },
          },
          data: { stock: { decrement: decrement.quantity } },
        });

        if (count === 0) throw new ProductOutOfStockError();

        const newStock = decrement.prevStock - decrement.quantity;
        const threshold = decrement.lowStockThreshold;
        const crossed =
          threshold != null &&
          newStock <= threshold &&
          decrement.prevStock > threshold;

        if (crossed) {
          lowStockProducts.push({
            id: decrement.productId,
            name: decrement.productName,
            stock: newStock,
            pricingMode: decrement.pricingMode,
          });
        }
      }

      const order = await tx.order.create({
        data,
        select: { id: true },
      });

      return { id: order.id, lowStockProducts };
    });
  }

  async update({
    id,
    data,
    filterParams,
  }: UpdateContentParams<string, Prisma.OrderUpdateInput>): Promise<void> {
    const params = transformValidFilterParams(filterParams);

    await prisma.order.update({
      where: {
        id,
        deleted_at: null,
        ...params,
      },
      data,
    });
  }

  async delete({
    id,
    filterParams,
  }: DeleteContentParams<string>): Promise<void> {
    await this.update({
      id,
      filterParams,
      data: { deleted_at: new Date() },
    });
  }
}
