import type { Prisma } from "@/generated/prisma/client.js";
import type { UserAddressWithDefault } from "@/types/address.js";

import type { ICRUDBase } from "../crud-base.js";
import { CursorPagination } from "../cursor-pagination.js";

export interface IAddressRepository
  extends
    ICRUDBase<
      UserAddressWithDefault,
      Prisma.UserAddressCreateInput,
      Prisma.UserAddressUpdateInput,
      string
    >,
    CursorPagination<UserAddressWithDefault, string> {}
