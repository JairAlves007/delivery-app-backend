import type { Closure } from "@/generated/prisma/client.js";

export type CreateClosureInput = {
	establishment_id: string;
	starts_at: Date;
	ends_at: Date | null;
	reason: string | null;
};

export interface IClosureRepository {
	create(data: CreateClosureInput): Promise<Closure>;
	endActiveClosures(params: {
		establishmentId: string;
		now: Date;
	}): Promise<number>;
}
