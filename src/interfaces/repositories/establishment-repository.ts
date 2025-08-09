import { Establishment, Product } from "@prisma/client";
import { ICRUDBase } from "../crud-base";

export interface IEstablishmentRepository extends ICRUDBase<Establishment> {}
