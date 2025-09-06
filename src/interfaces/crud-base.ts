export interface ICRUDBase<Model, CreateData, UpdateData, Id> {
	listAll(establishmentId?: string | null): Promise<Model[]>;
	count(establishmentId?: string | null): Promise<number>;
	paginate(
		page: number,
		limit: number,
		establishmentId?: string | null
	): Promise<Model[]>;
	findById(id: Id, establishmentId?: string): Promise<Model | null>;
	create(data: CreateData): Promise<Model>;
	update(id: Id, data: UpdateData): Promise<Model>;
	delete(id: Id, force: boolean): Promise<Model>;
}
