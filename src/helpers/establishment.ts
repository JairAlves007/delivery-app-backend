import { WeekDay } from "@/generated/prisma/client.js";
import type { EstablishmentFromRepository } from "@/types/establishment.js";

import { parseHourToToday } from "./date.js";

export function isEstablishmentOpen(
	establishment: EstablishmentFromRepository
): boolean {
	const now = new Date();

	if (establishment.is_manually_closed) return false;

	const activeClosure = establishment.closures.find(
		c => c.starts_at <= now && (c.ends_at == null || c.ends_at >= now)
	);

	if (activeClosure) return false;

	const today = now.getDay();
	const weekDays = Object.values(WeekDay);

	const schedule = establishment.openingHours.find(
		h => h.day_of_week === weekDays[today]
	);

	if (!schedule || schedule.is_closed) return false;

	const opensAt = parseHourToToday(schedule.opens_at);
	const closesAt = parseHourToToday(schedule.closes_at);

	return opensAt <= now && now <= closesAt;
}
