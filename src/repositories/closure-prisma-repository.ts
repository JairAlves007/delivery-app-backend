import type { Closure } from "@/generated/prisma/client.js";
import type {
	CreateClosureInput,
	IClosureRepository
} from "@/interfaces/repositories/closure-repository.js";
import prisma from "@/lib/prisma.js";

export class ClosurePrismaRepository implements IClosureRepository {
	async create(data: CreateClosureInput): Promise<Closure> {
		return await prisma.closure.create({ data });
	}

	async endActiveClosures({
		establishmentId,
		now
	}: {
		establishmentId: string;
		now: Date;
	}): Promise<number> {
		const result = await prisma.closure.updateMany({
			where: {
				establishment_id: establishmentId,
				starts_at: { lte: now },
				OR: [{ ends_at: null }, { ends_at: { gte: now } }]
			},
			data: { ends_at: now }
		});

		return result.count;
	}
}
