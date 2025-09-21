import type { IAddressRepository } from "@/interfaces/repositories/address-repository.ts";
import { prisma } from "@/lib/prisma.ts";
import type { Address, Prisma } from "@prisma/client";

export class AddressPrismaRepository implements IAddressRepository {
	async listAll(): Promise<Address[]> {
		return await prisma.address.findMany({
			where: {
				deleted_at: null
			},
			orderBy: {
				created_at: "desc"
			}
		});
	}

	async count(): Promise<number> {
		return await prisma.address.count({
			where: {
				deleted_at: null
			}
		});
	}

	async paginate(page: number, limit: number): Promise<Address[]> {
		return await prisma.address.findMany({
			skip: (page - 1) * limit,
			take: limit,
			where: {
				deleted_at: null
			},
			orderBy: {
				created_at: "desc"
			}
		});
	}

	async cursorPaginate(
		limit: number,
		cursor?: string | null,
		filterId?: string | null
	): Promise<Address[]> {
		return await prisma.address.findMany({
			where: {
				userAddresses: {
					some: {
						...(!!filterId && { user_id: filterId }),
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

	async findById(id: string): Promise<Address | null> {
		return await prisma.address.findUnique({
			where: {
				id,
				deleted_at: null
			}
		});
	}

	async create(data: Prisma.AddressCreateInput): Promise<Address> {
		return await prisma.address.create({ data });
	}

	async update(id: string, data: Prisma.AddressUpdateInput): Promise<Address> {
		return await prisma.address.update({
			where: {
				id,
				deleted_at: null
			},
			data
		});
	}

	async delete(id: string, force: boolean): Promise<Address> {
		if (force) {
			return await prisma.address.delete({
				where: {
					id
				}
			});
		}

		return await this.update(id, { deleted_at: new Date() });
	}
}
