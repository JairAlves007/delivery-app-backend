import { DigitalMenuNotFound } from "@/errors/digital-menu/digital-menu-not-found.js";
import type {
  DigitalMenuSource,
  DigitalMenuStatus,
} from "@/generated/prisma/client.js";
import type { IDigitalMenuRepository } from "@/interfaces/repositories/digital-menu-repository.js";

type GetDigitalMenuStatusParams = {
  establishmentId: string;
};

type GetDigitalMenuStatusResult = {
  status: DigitalMenuStatus;
  source: DigitalMenuSource;
  generatedAt: string | null;
};

export class GetDigitalMenuStatusService {
  private digitalMenuRepository: IDigitalMenuRepository;

  constructor(digitalMenuRepository: IDigitalMenuRepository) {
    this.digitalMenuRepository = digitalMenuRepository;
  }

  async handle({
    establishmentId,
  }: GetDigitalMenuStatusParams): Promise<GetDigitalMenuStatusResult> {
    const digitalMenu =
      await this.digitalMenuRepository.findByEstablishmentId(establishmentId);

    if (!digitalMenu) throw new DigitalMenuNotFound();

    return {
      status: digitalMenu.status,
      source: digitalMenu.source,
      generatedAt: digitalMenu.generated_at?.toISOString() ?? null,
    };
  }
}
