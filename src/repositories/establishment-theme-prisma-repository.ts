import type { EstablishmentTheme } from "@/generated/prisma/client.js";
import type {
	IEstablishmentThemeRepository,
	UpsertEstablishmentThemeInput
} from "@/interfaces/repositories/establishment-theme-repository.js";
import prisma from "@/lib/prisma.js";

export class EstablishmentThemePrismaRepository
	implements IEstablishmentThemeRepository
{
	async findByEstablishmentId(
		establishmentId: string
	): Promise<EstablishmentTheme | null> {
		return await prisma.establishmentTheme.findUnique({
			where: { establishment_id: establishmentId }
		});
	}

	async upsert({
		establishmentId,
		data
	}: {
		establishmentId: string;
		data: UpsertEstablishmentThemeInput;
	}): Promise<EstablishmentTheme> {
		return await prisma.establishmentTheme.upsert({
			where: { establishment_id: establishmentId },
			create: { establishment_id: establishmentId, ...data },
			update: data
		});
	}
}
