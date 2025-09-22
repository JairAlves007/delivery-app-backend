import { transformValidFilterParams } from "@/helpers/utils.ts";
import type { IAddressRepository } from "@/interfaces/repositories/address-repository.ts";
import { prisma } from "@/lib/prisma.ts";
import {
	CursorPaginationParams,
	DeleteContentParams,
	FilterParams,
	FindByIdParams,
	PaginationParams,
	UpdateContentParams
} from "@/types/crud.ts";
import type { Address, Prisma } from "@prisma/client";

export class AddressPrismaRepository implements IAddressRepository {
	async listAll(filterParams?: FilterParams): Promise<Address[]> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.address.findMany({
			where: {
				deleted_at: null,
				...params
			},
			orderBy: {
				created_at: "desc"
			}
		});
	}

	async count(filterParams?: FilterParams): Promise<number> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.address.count({
			where: {
				deleted_at: null,
				...params
			}
		});
	}

	async paginate({
		page,
		perPage,
		filterParams
	}: PaginationParams): Promise<Address[]> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.address.findMany({
			skip: (page - 1) * perPage,
			take: perPage,
			where: {
				deleted_at: null,
				...params
			},
			orderBy: {
				created_at: "desc"
			}
		});
	}

	async cursorPaginate({
		limit,
		cursor,
		filterParams
	}: CursorPaginationParams<string>): Promise<Address[]> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.address.findMany({
			where: {
				userAddresses: {
					some: {
						...params,
						deleted_at: null
					}
				},
				deleted_at: null
			},
			orderBy: {
				created_at: "desc"
			},
			take: limit + 1,
			skip: cursor ? 1 : 0,
			cursor: !!cursor ? { id: cursor } : undefined
		});
	}

	async findById({
		id,
		filterParams
	}: FindByIdParams<string>): Promise<Address | null> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.address.findUnique({
			where: {
				id,
				deleted_at: null,
				...params
			}
		});
	}

	async create(data: Prisma.AddressCreateInput): Promise<Address> {
		return await prisma.address.create({ data });
	}

	async update({
		id,
		data,
		filterParams
	}: UpdateContentParams<string, Prisma.AddressUpdateInput>): Promise<Address> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.address.update({
			where: {
				id,
				deleted_at: null,
				...params
			},
			data
		});
	}

	async delete({
		id,
		force,
		filterParams
	}: DeleteContentParams<string>): Promise<Address> {
		const params = transformValidFilterParams(filterParams);

		if (force) {
			return await prisma.address.delete({
				where: {
					id,
					...params
				}
			});
		}

		return await this.update({
			id,
			filterParams,
			data: { deleted_at: new Date() }
		});
	}
}
