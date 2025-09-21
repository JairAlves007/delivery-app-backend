export interface ICRUDBase<Model, CreateData, UpdateData, Id> {
	listAll(filterId?: string | null): Promise<Model[]>;
	count(filterId?: string | null): Promise<number>;
	paginate(
		page: number,
		limit: number,
		filterId?: string | null
	): Promise<Model[]>;
	findById(id: Id, filterId?: string): Promise<Model | null>;
	create(data: CreateData): Promise<Model>;
	update(id: Id, data: UpdateData): Promise<Model>;
	delete(id: Id, force: boolean): Promise<Model>;
}
