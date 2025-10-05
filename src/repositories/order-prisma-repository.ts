import type {
	FilterParams,
	PaginationParams,
	FindByIdParams,
	UpdateContentParams,
	DeleteContentParams
} from "@/types/crud.ts";
import type { IOrderRepository } from "@/interfaces/repositories/order-repository.ts";
import type { OrderFromRepository } from "@/types/order.ts";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma.ts";
import { transformValidFilterParams } from "@/helpers/crud.ts";

export class OrderPrismaRepository implements IOrderRepository {
	async listAll(filterParams?: FilterParams): Promise<OrderFromRepository[]> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.order.findMany({
			where: {
				deleted_at: null,
				...params
			},
			include: {
				coupon: true,
				items: true
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
				items: true
			},
			orderBy: {
				created_at: "desc"
			}
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
				items: true
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
		const params = transformValidFilterParams(filterParams);

		await this.update({
			id,
			filterParams,
			data: { deleted_at: new Date() }
		});
	}
}
