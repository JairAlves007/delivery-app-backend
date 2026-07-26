import Constants from "./constants.js";

export const startOfDayInTimezone = (date: string): Date =>
  new Date(`${date}T00:00:00.000${Constants.DASHBOARD_TIMEZONE_OFFSET}`);

export const endOfDayInTimezone = (date: string): Date =>
  new Date(`${date}T23:59:59.999${Constants.DASHBOARD_TIMEZONE_OFFSET}`);

export const formatDateToHumanReadable = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: Constants.DASHBOARD_TIMEZONE,
  };

  const formatter = new Intl.DateTimeFormat("pt-BR", options);

  const defaultFormat: string = formatter.format(date);

  return defaultFormat.replace(", ", " às ");
};
