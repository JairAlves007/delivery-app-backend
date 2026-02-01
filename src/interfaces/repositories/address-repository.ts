import type { Prisma } from "@/generated/prisma/client.ts";
import type { UserAddressWithDefault } from "@/types/address.ts";
import type { ICRUDBase } from "../crud-base.ts";
import { CursorPagination } from "../cursor-pagination.ts";

export interface IAddressRepository
	extends
		ICRUDBase<
			UserAddressWithDefault,
			Prisma.UserAddressCreateInput,
			Prisma.UserAddressUpdateInput,
			string
		>,
		CursorPagination<UserAddressWithDefault, string> {}
