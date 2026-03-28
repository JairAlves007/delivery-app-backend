import type { Prisma } from "@/generated/prisma/client.js";
import type { OrderFromRepository } from "@/types/order.js";

import type { ICRUDBase } from "../crud-base.js";
import type { CursorPagination } from "../cursor-pagination.js";

export interface IOrderRepository
	extends
		ICRUDBase<
			OrderFromRepository,
			Prisma.OrderCreateInput,
			Prisma.OrderUpdateInput,
			string
		>,
		CursorPagination<OrderFromRepository, string> {}
