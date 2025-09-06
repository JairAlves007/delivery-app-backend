import { InvalidPage } from "@/errors/pagination/invalid-page.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import type { ICouponRepository } from "@/interfaces/repositories/coupon-repository.ts";
import { paginationQueryParamsSchema } from "@/schemas/generic-schema.ts";
import type { Coupon } from "@prisma/client";
import z from "zod";

type ListCouponServiceRequest = z.infer<typeof paginationQueryParamsSchema>;

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
		perPage
	}: ListCouponServiceRequest): Promise<ListCouponServiceResponse> {
		const cache = makeCache();

		const isPaging = !!page;
		const totalPromise = cache.rememberForever(
			`total_${cache.keys.coupons}`,
			async () => await this.couponRepository.count()
		);

		if (isPaging) {
			const [total, coupons] = await Promise.all([
				totalPromise,
				cache.rememberForever(
					`${cache.keys.coupons}_page_${page}_per_page_${perPage}`,
					async () => await this.couponRepository.paginate(page, perPage)
				)
			]);

			const totalPages = Math.ceil(total / perPage);

			if (page > totalPages) throw new InvalidPage();

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
				`all_${cache.keys.coupons}`,
				async () => await this.couponRepository.listAll()
			)
		]);

		return {
			coupons,
			page,
			total
		};
	}
}
