import { Establishment } from "@prisma/client";
import { ICRUDBase } from "../crud-base";

export interface IEstablishmentRepository extends ICRUDBase<Establishment> {}
