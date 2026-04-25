import {
  DeleteContentParams,
  FilterParams,
  FindByIdParams,
  PaginationParams,
  UpdateContentParams,
} from "@/types/crud.js";

export interface ICRUDBase<
  Model,
  CreateData,
  UpdateData,
  Id,
  ReturningModel = void,
> {
  listAll(filterParams?: FilterParams): Promise<Model[]>;
  count(filterParams?: FilterParams): Promise<number>;
  paginate(paginationParams: PaginationParams): Promise<Model[]>;
  findById(findByIdParams: FindByIdParams<Id>): Promise<Model | null>;
  create(data: CreateData): Promise<ReturningModel>;
  update(
    updateParams: UpdateContentParams<Id, UpdateData>,
  ): Promise<ReturningModel>;
  delete(deleteParams: DeleteContentParams<Id>): Promise<void>;
}
