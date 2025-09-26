import { transformValidFilterParams } from "@/helpers/crud.ts";
import type { IAddressRepository } from "@/interfaces/repositories/address-repository.ts";
import { prisma } from "@/lib/prisma.ts";
import type { UserAddressWithDefault } from "@/types/address.ts";
import type {
	CursorPaginationParams,
	DeleteContentParams,
	FilterParams,
	FindByIdParams,
	PaginationParams,
	UpdateContentParams
} from "@/types/crud.ts";
import type { Prisma } from "@prisma/client";

type UserAddressStructured = Prisma.UserAddressGetPayload<{
	select: {
		id: true;
		is_default: true;
		address: true;
	};
}>;

export class AddressPrismaRepository implements IAddressRepository {
	private getBaseWhere(
		filterParams?: FilterParams
	): Prisma.UserAddressWhereInput {
		const params = transformValidFilterParams(filterParams);

		return {
			address: {
				deleted_at: null
			},
			deleted_at: null,
			...params
		};
	}

	private transformAddress(
		address: UserAddressStructured
	): UserAddressWithDefault {
		return {
			...address.address,
			id: address.id,
			is_default: address.is_default
		};
	}

	async listAll(
		filterParams?: FilterParams
	): Promise<UserAddressWithDefault[]> {
		const where = this.getBaseWhere(filterParams);

		const addresses = await prisma.userAddress.findMany({
			select: {
				id: true,
				is_default: true,
				address: true
			},
			where,
			orderBy: {
				created_at: "desc"
			}
		});

		return addresses.map(address => this.transformAddress(address));
	}

	async count(filterParams?: FilterParams): Promise<number> {
		const where = this.getBaseWhere(filterParams);

		return await prisma.userAddress.count({
			where
		});
	}

	async paginate({
		page,
		perPage,
		filterParams
	}: PaginationParams): Promise<UserAddressWithDefault[]> {
		const where = this.getBaseWhere(filterParams);

		const addresses = await prisma.userAddress.findMany({
			select: {
				id: true,
				is_default: true,
				address: true
			},
			skip: (page - 1) * perPage,
			take: perPage,
			where,
			orderBy: {
				created_at: "desc"
			}
		});

		return addresses.map(address => this.transformAddress(address));
	}

	async cursorPaginate({
		limit,
		cursor,
		filterParams
	}: CursorPaginationParams<string>): Promise<UserAddressWithDefault[]> {
		const where = this.getBaseWhere(filterParams);

		const addresses = await prisma.userAddress.findMany({
			select: {
				id: true,
				is_default: true,
				address: true
			},
			where,
			orderBy: {
				created_at: "desc"
			},
			take: limit + 1,
			skip: cursor ? 1 : 0,
			cursor: !!cursor ? { id: cursor } : undefined
		});

		return addresses.map(address => this.transformAddress(address));
	}

	async findById({
		id,
		filterParams
	}: FindByIdParams<string>): Promise<UserAddressWithDefault | null> {
		const where = this.getBaseWhere(filterParams);

		const address = await prisma.userAddress.findFirst({
			select: {
				id: true,
				is_default: true,
				address: true
			},
			where: {
				id,
				AND: [where]
			}
		});

		return address ? this.transformAddress(address) : null;
	}

	async create(
		data: Prisma.UserAddressCreateInput
	): Promise<UserAddressWithDefault> {
		const address = await prisma.userAddress.create({
			select: {
				id: true,
				is_default: true,
				address: true
			},
			data
		});

		return this.transformAddress(address);
	}

	async update({
		id,
		data,
		filterParams
	}: UpdateContentParams<
		string,
		Prisma.UserAddressUpdateInput
	>): Promise<UserAddressWithDefault> {
		const where = this.getBaseWhere(filterParams);

		const address = await prisma.userAddress.update({
			select: {
				id: true,
				is_default: true,
				address: true
			},
			where: {
				id,
				AND: [where]
			},
			data
		});

		return this.transformAddress(address);
	}

	async delete({
		id,
		force,
		filterParams
	}: DeleteContentParams<string>): Promise<UserAddressWithDefault> {
		const where = this.getBaseWhere(filterParams);

		if (force) {
			const address = await prisma.userAddress.delete({
				select: {
					id: true,
					is_default: true,
					address: true
				},
				where: {
					id,
					AND: [where]
				}
			});

			return this.transformAddress(address);
		}

		return await this.update({
			id,
			filterParams,
			data: { deleted_at: new Date() }
		});
	}
}
