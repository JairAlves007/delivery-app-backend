import { makeCache } from "@/factories/services/cache/make-cache.js";
import type { EstablishmentTheme } from "@/generated/prisma/client.js";
import Constants from "@/helpers/constants.js";
import type {
	IEstablishmentThemeRepository,
	UpsertEstablishmentThemeInput
} from "@/interfaces/repositories/establishment-theme-repository.js";

export type UpdateEstablishmentThemeBody = {
	primary?: string;
	secondary?: string;
	destructive?: string;
	background?: string;
	foreground?: string;
	muted?: string;
	border?: string;
	primaryDark?: string;
	secondaryDark?: string;
	destructiveDark?: string;
	backgroundDark?: string;
	foregroundDark?: string;
	mutedDark?: string;
	borderDark?: string;
};

const buildUpsertInput = (params: {
	current: EstablishmentTheme | null;
	body: UpdateEstablishmentThemeBody;
}): UpsertEstablishmentThemeInput => {
	const { current, body } = params;
	const defaults = Constants.DEFAULT_ESTABLISHMENT_THEME;

	return {
		primary: body.primary ?? current?.primary ?? defaults.colors.primary,
		secondary:
			body.secondary ?? current?.secondary ?? defaults.colors.secondary,
		destructive:
			body.destructive ?? current?.destructive ?? defaults.colors.destructive,
		background:
			body.background ?? current?.background ?? defaults.colors.background,
		foreground:
			body.foreground ?? current?.foreground ?? defaults.colors.foreground,
		muted: body.muted ?? current?.muted ?? defaults.colors.muted,
		border: body.border ?? current?.border ?? defaults.colors.border,
		primary_dark:
			body.primaryDark ?? current?.primary_dark ?? defaults.colorsDark.primary,
		secondary_dark:
			body.secondaryDark ??
			current?.secondary_dark ??
			defaults.colorsDark.secondary,
		destructive_dark:
			body.destructiveDark ??
			current?.destructive_dark ??
			defaults.colorsDark.destructive,
		background_dark:
			body.backgroundDark ??
			current?.background_dark ??
			defaults.colorsDark.background,
		foreground_dark:
			body.foregroundDark ??
			current?.foreground_dark ??
			defaults.colorsDark.foreground,
		muted_dark:
			body.mutedDark ?? current?.muted_dark ?? defaults.colorsDark.muted,
		border_dark:
			body.borderDark ?? current?.border_dark ?? defaults.colorsDark.border
	};
};

export class UpdateEstablishmentThemeService {
	private establishmentThemeRepository: IEstablishmentThemeRepository;

	constructor(establishmentThemeRepository: IEstablishmentThemeRepository) {
		this.establishmentThemeRepository = establishmentThemeRepository;
	}

	async handle(params: {
		establishmentId: string;
		body: UpdateEstablishmentThemeBody;
	}): Promise<EstablishmentTheme> {
		const { establishmentId, body } = params;

		const current =
			await this.establishmentThemeRepository.findByEstablishmentId(
				establishmentId
			);

		const data = buildUpsertInput({ current, body });

		const updated = await this.establishmentThemeRepository.upsert({
			establishmentId,
			data
		});

		const cache = makeCache();
		await Promise.all([
			cache.forgetKeysContaining(
				`${cache.keys.establishmentTheme}_${establishmentId}`
			),
			cache.forgetKeysContaining(cache.keys.establishments)
		]);

		return updated;
	}
}
