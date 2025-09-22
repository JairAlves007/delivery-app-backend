import {
	DeleteContentParams,
	FilterParams,
	FindByIdParams,
	PaginationParams,
	UpdateContentParams
} from "@/types/crud.ts";

export interface ICRUDBase<Model, CreateData, UpdateData, Id> {
	listAll(filterParams?: FilterParams): Promise<Model[]>;
	count(filterParams?: FilterParams): Promise<number>;
	paginate(paginationParams: PaginationParams): Promise<Model[]>;
	findById(findByIdParams: FindByIdParams<Id>): Promise<Model | null>;
	create(data: CreateData): Promise<Model>;
	update(updateParams: UpdateContentParams<Id, UpdateData>): Promise<Model>;
	delete(deleteParams: DeleteContentParams<Id>): Promise<Model>;
}
