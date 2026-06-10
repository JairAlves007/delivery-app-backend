import z from "zod";

import { InvalidPage } from "@/errors/pagination/invalid-page.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import type { Coupon } from "@/generated/prisma/client.js";
import Constants from "@/helpers/constants.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import type { ICouponRepository } from "@/interfaces/repositories/coupon-repository.js";
import { listQueryParamsSchema } from "@/schemas/generic-schema.js";
import type { FilterField, PaginatedResponse } from "@/types/crud.js";

type ListCouponServiceRequest = z.infer<typeof listQueryParamsSchema> &
  FilterField;

type ListCouponServiceResponse = PaginatedResponse<Coupon>;

export class ListCouponService {
  private couponRepository: ICouponRepository;

  constructor(couponRepository: ICouponRepository) {
    this.couponRepository = couponRepository;
  }

  async handle({
    page,
    perPage,
    filterParams,
  }: ListCouponServiceRequest): Promise<ListCouponServiceResponse> {
    const cache = makeCache();
    const prefixKey = getFilterParamsCacheKey(filterParams);

    const isPaging = !!page;
    const totalPromise = cache.remember(
      `${prefixKey}total_${cache.keys.coupons}`,
      Constants.CACHE_TTL.coupons,
      async () => await this.couponRepository.count(filterParams),
      { domain: "coupons", establishmentId: filterParams?.establishment_id },
    );

    if (isPaging) {
      const key = `${prefixKey}${cache.keys.coupons}_page_${page}_per_page_${perPage}`;

      const [total, coupons] = await Promise.all([
        totalPromise,
        cache.remember(
          key,
          Constants.CACHE_TTL.coupons,
          async () =>
            await this.couponRepository.paginate({
              page,
              perPage,
              filterParams,
            }),
          {
            domain: "coupons",
            establishmentId: filterParams?.establishment_id,
          },
        ),
      ]);

      const totalPages = Math.ceil(total / perPage);

      if (page > totalPages && totalPages > 0) {
        await cache.forget(key);
        throw new InvalidPage();
      }

      return {
        items: coupons,
        pagination: {
          page,
          perPage,
          total,
          totalPages,
        },
      };
    }

    const [total, coupons] = await Promise.all([
      totalPromise,
      cache.remember(
        `${prefixKey}all_${cache.keys.coupons}`,
        Constants.CACHE_TTL.coupons,
        async () => await this.couponRepository.listAll(filterParams),
        { domain: "coupons", establishmentId: filterParams?.establishment_id },
      ),
    ]);

    return {
      items: coupons,
      pagination: {
        page: 1,
        perPage: total,
        total,
        totalPages: 1,
      },
    };
  }
}
