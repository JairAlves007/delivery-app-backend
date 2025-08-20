export interface ICRUDBase<Model, CreateData, UpdateData, Id> {
	listAll(): Promise<Model[]>;
	count(): Promise<number>;
	paginate(page: number, limit: number): Promise<Model[]>;
	findById(id: Id): Promise<Model | null>;
	create(data: CreateData): Promise<Model>;
	update(id: Id, data: UpdateData): Promise<Model>;
	delete(id: Id, force: boolean): Promise<Model>;
}
