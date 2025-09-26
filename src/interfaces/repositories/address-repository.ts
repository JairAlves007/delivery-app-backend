import type { Prisma } from "@prisma/client";
import type { ICRUDBase } from "../crud-base.ts";
import type { UserAddressWithDefault } from "@/types/address.ts";
import { CursorPagination } from "../cursor-pagination.ts";

export interface IAddressRepository
	extends ICRUDBase<
			UserAddressWithDefault,
			Prisma.UserAddressCreateInput,
			Prisma.UserAddressUpdateInput,
			string
		>,
		CursorPagination<UserAddressWithDefault, string> {}
