import z from "zod";

import { InvalidPage } from "@/errors/pagination/invalid-page.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import Constants from "@/helpers/constants.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import {
  endOfDayInTimezone,
  startOfDayInTimezone,
} from "@/helpers/date.js";
import { transformOrderByStatus } from "@/helpers/order.js";
import type { IOrderRepository } from "@/interfaces/repositories/order-repository.js";
import { listOrdersQueryParamsSchema } from "@/schemas/order-schema.js";
import type { FilterField, PaginatedResponse } from "@/types/crud.js";
import type {
  OrderFromRepository,
  OrderListFilters,
  OrderPayload,
} from "@/types/order.js";

type ListOrderServiceRequest = z.infer<typeof listOrdersQueryParamsSchema> &
  FilterField;

type ListOrderServiceResponse = PaginatedResponse<OrderPayload>;

export class ListOrderService {
  private orderRepository: IOrderRepository;

  constructor(orderRepository: IOrderRepository) {
    this.orderRepository = orderRepository;
  }

  private mapOrders(orders: OrderFromRepository[]): OrderPayload[] {
    return orders.map((order) => {
      return transformOrderByStatus(order);
    });
  }

  async handle({
    page,
    perPage,
    filterParams,
    dateStart,
    dateEnd,
    includeScheduled,
  }: ListOrderServiceRequest): Promise<ListOrderServiceResponse> {
    const cache = makeCache();

    const orderFilters: OrderListFilters = {
      dateStart: dateStart ? startOfDayInTimezone(dateStart) : null,
      dateEnd: dateEnd ? endOfDayInTimezone(dateEnd) : null,
      includeScheduled,
    };

    const scheduleKeyPart = `ds_${dateStart ?? ""}_de_${dateEnd ?? ""}_sc_${
      includeScheduled ? 1 : 0
    }_`;
    const prefixKey = `${getFilterParamsCacheKey(filterParams)}${scheduleKeyPart}`;

    const isPaging = !!page;
    const ttl = Constants.CACHE_TTL.orders;
    const totalPromise = cache.remember(
      `${prefixKey}total_${cache.keys.orders}`,
      ttl,
      async () => await this.orderRepository.count(filterParams, orderFilters),
      { domain: "orders", establishmentId: filterParams?.establishment_id },
    );

    if (isPaging) {
      const key = `${prefixKey}${cache.keys.orders}_page_${page}_per_page_${perPage}`;
      const [total, orders] = await Promise.all([
        totalPromise,
        cache.remember(
          key,
          ttl,
          async () =>
            await this.orderRepository.paginate(
              {
                page,
                perPage,
                filterParams,
              },
              orderFilters,
            ),
          { domain: "orders", establishmentId: filterParams?.establishment_id },
        ),
      ]);

      const totalPages = Math.ceil(total / perPage);

      if (page > totalPages && totalPages > 0) {
        await cache.forget(key);
        throw new InvalidPage();
      }

      return {
        items: this.mapOrders(orders),
        pagination: {
          page,
          perPage,
          total,
          totalPages,
        },
      };
    }

    const [total, orders] = await Promise.all([
      totalPromise,
      cache.remember(
        `${prefixKey}${cache.keys.orders}`,
        ttl,
        async () =>
          await this.orderRepository.listAll(filterParams, orderFilters),
        { domain: "orders", establishmentId: filterParams?.establishment_id },
      ),
    ]);

    return {
      items: this.mapOrders(orders),
      pagination: {
        page: 1,
        perPage: total,
        total,
        totalPages: 1,
      },
    };
  }
}
