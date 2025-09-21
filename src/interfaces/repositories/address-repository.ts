import type { Address, Prisma } from "@prisma/client";
import type { ICRUDBase } from "../crud-base.ts";
import { CursorPagination } from "../cursor-pagination.ts";

export interface IAddressRepository
	extends ICRUDBase<
			Address,
			Prisma.AddressCreateInput,
			Prisma.AddressUpdateInput,
			string
		>,
		CursorPagination<Address, string> {}
