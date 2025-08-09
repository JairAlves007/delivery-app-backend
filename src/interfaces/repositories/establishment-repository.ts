import { Establishment, Prisma } from "@prisma/client";

export interface IEstablishmentRepository {
	listAll(): Promise<Establishment[]>;
	count(): Promise<number>;
	paginate(page: number, limit: number): Promise<Establishment[]>;
	findById(id: string): Promise<Establishment | null>;
	create(data: Prisma.EstablishmentCreateInput): Promise<Establishment>;
	update(data: Prisma.EstablishmentUpdateInput): Promise<Establishment>;
	delete(id: string): Promise<Establishment>;
}
