import type { Prisma } from "@/generated/prisma/client.js";
import { transformValidFilterParams } from "@/helpers/crud.js";
import type { IOrderRepository } from "@/interfaces/repositories/order-repository.js";
import prisma from "@/lib/prisma.js";
import type {
	CursorPaginationParams,
	DeleteContentParams,
	FilterParams,
	FindByIdParams,
	PaginationParams,
	UpdateContentParams
} from "@/types/crud.js";
import type { OrderFromRepository } from "@/types/order.js";

export class OrderPrismaRepository implements IOrderRepository {
	async listAll(filterParams?: FilterParams): Promise<OrderFromRepository[]> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.order.findMany({
			where: {
				deleted_at: null,
				...params
			},
			take: 200,
			include: {
				coupon: true,
				items: true,
				statuses: {
					select: {
						label: true,
						value: true
					},
					orderBy: {
						created_at: "desc"
					},
					take: 1
				}
			},
			orderBy: {
				created_at: "desc"
			}
		});
	}

	async count(filterParams?: FilterParams): Promise<number> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.order.count({
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
	}: PaginationParams): Promise<OrderFromRepository[]> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.order.findMany({
			skip: (page - 1) * perPage,
			take: perPage,
			where: {
				deleted_at: null,
				...params
			},
			include: {
				coupon: true,
				items: true,
				statuses: {
					select: {
						label: true,
						value: true
					},
					orderBy: {
						created_at: "desc"
					},
					take: 1
				}
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
	}: CursorPaginationParams<string>): Promise<OrderFromRepository[]> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.order.findMany({
			where: {
				deleted_at: null,
				...params
			},
			include: {
				coupon: true,
				items: true,
				statuses: {
					select: {
						label: true,
						value: true
					},
					orderBy: {
						created_at: "desc"
					},
					take: 1
				}
			},
			orderBy: {
				created_at: "desc"
			},
			take: limit + 1,
			skip: cursor ? 1 : 0,
			cursor: cursor ? { id: cursor } : undefined
		});
	}

	async findById({
		id,
		filterParams
	}: FindByIdParams<string>): Promise<OrderFromRepository | null> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.order.findUnique({
			where: {
				id,
				deleted_at: null,
				...params
			},
			include: {
				coupon: true,
				items: true,
				statuses: {
					select: {
						label: true,
						value: true
					},
					orderBy: {
						created_at: "desc"
					},
					take: 1
				}
			}
		});
	}

	async create(data: Prisma.OrderCreateInput): Promise<void> {
		await prisma.order.create({ data });
	}

	async update({
		id,
		data,
		filterParams
	}: UpdateContentParams<string, Prisma.OrderUpdateInput>): Promise<void> {
		const params = transformValidFilterParams(filterParams);

		await prisma.order.update({
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
		filterParams
	}: DeleteContentParams<string>): Promise<void> {
		await this.update({
			id,
			filterParams,
			data: { deleted_at: new Date() }
		});
	}
}
