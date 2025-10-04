import { InvalidPage } from "@/errors/pagination/invalid-page.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import { getFilterParamsCacheKey } from "@/helpers/crud.ts";
import type { ICouponRepository } from "@/interfaces/repositories/coupon-repository.ts";
import { listQueryParamsSchema } from "@/schemas/generic-schema.ts";
import type { FilterField } from "@/types/crud.ts";
import type { Coupon } from "@prisma/client";
import z from "zod";

type ListCouponServiceRequest = z.infer<typeof listQueryParamsSchema> &
	FilterField;

interface ListCouponServiceResponse
	extends Pick<ListCouponServiceRequest, "page"> {
	coupons: Coupon[];
	total: number;
	perPage?: number;
	totalPages?: number;
}

export class ListCouponService {
	private couponRepository: ICouponRepository;

	constructor(couponRepository: ICouponRepository) {
		this.couponRepository = couponRepository;
	}

	async handle({
		page,
		perPage,
		filterParams
	}: ListCouponServiceRequest): Promise<ListCouponServiceResponse> {
		const cache = makeCache();
		const prefixKey = getFilterParamsCacheKey(filterParams);

		const isPaging = !!page;
		const totalPromise = cache.rememberForever(
			`${prefixKey}total_${cache.keys.coupons}`,
			async () => await this.couponRepository.count(filterParams)
		);

		if (isPaging) {
			const key = `${prefixKey}${cache.keys.coupons}_page_${page}_per_page_${perPage}`;

			const [total, coupons] = await Promise.all([
				totalPromise,
				cache.rememberForever(
					key,
					async () =>
						await this.couponRepository.paginate({
							page,
							perPage,
							filterParams
						})
				)
			]);

			const totalPages = Math.ceil(total / perPage);

			if (page > totalPages) {
				await cache.forget(key);
				throw new InvalidPage();
			}

			return {
				coupons,
				page,
				perPage,
				total,
				totalPages
			};
		}

		const [total, coupons] = await Promise.all([
			totalPromise,
			cache.rememberForever(
				`${prefixKey}all_${cache.keys.coupons}`,
				async () => await this.couponRepository.listAll(filterParams)
			)
		]);

		return {
			coupons,
			page,
			total
		};
	}
}
