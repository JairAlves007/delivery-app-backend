import { WeekDay } from "@/generated/prisma/client.js";
import type { EstablishmentsList } from "@/types/establishment.js";

import Constants from "./constants.js";

const WEEK_DAYS: WeekDay[] = [
  WeekDay.SUNDAY,
  WeekDay.MONDAY,
  WeekDay.TUESDAY,
  WeekDay.WEDNESDAY,
  WeekDay.THURSDAY,
  WeekDay.FRIDAY,
  WeekDay.SATURDAY,
];

const parseHourToMinutes = (hour: string): number => {
  const [h, m] = hour.split(":").map(Number);
  return h * 60 + m;
};

const getZonedWeekdayAndMinutes = (
  now: Date,
): { weekdayIndex: number; minutesOfDay: number } => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: Constants.DASHBOARD_TIMEZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "Sun";
  const hourRaw = parts.find((p) => p.type === "hour")?.value ?? "00";
  const minuteRaw = parts.find((p) => p.type === "minute")?.value ?? "00";

  const hour = Number(hourRaw) % 24;
  const minute = Number(minuteRaw);

  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  return {
    weekdayIndex: weekdayMap[weekday] ?? 0,
    minutesOfDay: hour * 60 + minute,
  };
};

export function isEstablishmentOpenAt(
  establishment: Pick<EstablishmentsList, "closures" | "openingHours">,
  date: Date,
): boolean {
  const activeClosure = establishment.closures.find(
    (c) => c.starts_at <= date && (c.ends_at == null || c.ends_at >= date),
  );

  if (activeClosure) return false;

  const { weekdayIndex, minutesOfDay } = getZonedWeekdayAndMinutes(date);
  const todayWeekDay = WEEK_DAYS[weekdayIndex];
  const previousWeekDay = WEEK_DAYS[(weekdayIndex + 6) % 7];

  const todayEntries = establishment.openingHours.filter(
    (h) => h.day_of_week === todayWeekDay && !h.is_closed,
  );

  for (const entry of todayEntries) {
    const opens = parseHourToMinutes(entry.opens_at);
    const closes = parseHourToMinutes(entry.closes_at);

    if (opens === closes) continue;

    if (closes > opens) {
      if (minutesOfDay >= opens && minutesOfDay < closes) return true;
    } else {
      if (minutesOfDay >= opens) return true;
    }
  }

  const previousEntries = establishment.openingHours.filter(
    (h) => h.day_of_week === previousWeekDay && !h.is_closed,
  );

  for (const entry of previousEntries) {
    const opens = parseHourToMinutes(entry.opens_at);
    const closes = parseHourToMinutes(entry.closes_at);

    if (closes < opens && minutesOfDay < closes) return true;
  }

  return false;
}

export function isEstablishmentOpen(
  establishment: Pick<EstablishmentsList, "closures" | "openingHours">,
): boolean {
  return isEstablishmentOpenAt(establishment, new Date());
}

export function hasConfiguredOpeningHours(
  establishment: Pick<EstablishmentsList, "openingHours">,
): boolean {
  return establishment.openingHours.some((h) => !h.is_closed);
}
