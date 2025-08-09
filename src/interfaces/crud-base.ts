export interface ICRUDBase<Model> {
	listAll(): Promise<Model[]>;
	count(): Promise<number>;
	paginate(page: number, limit: number): Promise<Model[]>;
	findById(id: string): Promise<Model | null>;
	create<Data>(data: Data): Promise<Model>;
	update<Id, Data>(id: Id, data: Data): Promise<Model>;
	delete<Id>(id: Id, force: boolean): Promise<Model>;
}
