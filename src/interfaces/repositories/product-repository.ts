import type { Prisma, Product } from "@prisma/client";
import type { ICRUDBase } from "../crud-base.ts";

export interface IProductRepository
	extends ICRUDBase<Product, Prisma.ProductCreateInput, string> {}
