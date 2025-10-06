import type { Prisma } from "@prisma/client";
import type { ICRUDBase } from "../crud-base.ts";
import type { OrderFromRepository } from "@/types/order.ts";
import type { CursorPagination } from "../cursor-pagination.ts";

export interface IOrderRepository
	extends ICRUDBase<
			OrderFromRepository,
			Prisma.OrderCreateInput,
			Prisma.OrderUpdateInput,
			string
		>,
		CursorPagination<OrderFromRepository, string> {}
