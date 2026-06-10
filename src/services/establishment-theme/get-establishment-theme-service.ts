import { makeCache } from "@/factories/services/cache/make-cache.js";
import Constants from "@/helpers/constants.js";
import type { IEstablishmentThemeRepository } from "@/interfaces/repositories/establishment-theme-repository.js";

import {
	type EstablishmentThemePayload,
	mapEstablishmentTheme} from "./map-establishment-theme.js";

export class GetEstablishmentThemeService {
	private establishmentThemeRepository: IEstablishmentThemeRepository;

	constructor(establishmentThemeRepository: IEstablishmentThemeRepository) {
		this.establishmentThemeRepository = establishmentThemeRepository;
	}

	async handle(establishmentId: string): Promise<EstablishmentThemePayload> {
		const cache = makeCache();
		const key = `${cache.keys.establishmentTheme}_${establishmentId}`;

		return await cache.remember(
			key,
			Constants.CACHE_TTL.establishmentTheme,
			async () => {
				const row =
					await this.establishmentThemeRepository.findByEstablishmentId(
						establishmentId
					);

				return mapEstablishmentTheme({ row });
			},
			{ domain: "establishmentTheme", establishmentId }
		);
	}
}
