import z from "zod";

import { InvalidPage } from "@/errors/pagination/invalid-page.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import { RoleType } from "@/generated/prisma/client.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import type { IUserRepository } from "@/interfaces/repositories/user-repository.js";
import { listQueryParamsSchema } from "@/schemas/generic-schema.js";
import type { PaginatedResponse } from "@/types/crud.js";
import type { UserWithRole } from "@/types/user.js";

type ListEstablishmentOwnerRequest = z.infer<typeof listQueryParamsSchema>;

export class ListEstablishmentOwnerService {
	private userRepository: IUserRepository;

	constructor(userRepository: IUserRepository) {
		this.userRepository = userRepository;
	}

	async handle({
		page,
		perPage,
		...filterParams
	}: ListEstablishmentOwnerRequest): Promise<PaginatedResponse<UserWithRole>> {
		const cache = makeCache();
		const prefixKey = `${cache.keys.users}_owners_${getFilterParamsCacheKey(
			filterParams
		)}`;

		const role = RoleType.ESTABLISHMENT_OWNER;
		const isPaging = !!page;

		const totalPromise = cache.rememberForever(
			`${prefixKey}total`,
			async () => await this.userRepository.countByRole(role, filterParams)
		);

		if (isPaging) {
			const key = `${prefixKey}page_${page}_per_page_${perPage}`;
			const [total, items] = await Promise.all([
				totalPromise,
				cache.rememberForever(
					key,
					async () =>
						await this.userRepository.paginateByRole(role, {
							page,
							perPage,
							filterParams
						})
				)
			]);

			const totalPages = Math.ceil(total / perPage);

			if (page > totalPages && totalPages > 0) {
				await cache.forget(key);
				throw new InvalidPage();
			}

			return {
				items,
				pagination: { page, perPage, total, totalPages }
			};
		}

		const [total, items] = await Promise.all([
			totalPromise,
			cache.rememberForever(
				`${prefixKey}all`,
				async () => await this.userRepository.listAllByRole(role, filterParams)
			)
		]);

		return {
			items,
			pagination: { page: 1, perPage: total, total, totalPages: 1 }
		};
	}
}
