export function parseHourToToday(hour: string): Date {
	const [hours, minutes] = hour.split(":").map(Number);

	const now = new Date();
	const date = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate(),
		hours,
		minutes,
		0
	);

	return date;
}

export const formatDateToHumanReadable = (date: Date): string => {
	const options: Intl.DateTimeFormatOptions = {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
		timeZone: "America/Sao_Paulo"
	};

	const formatter = new Intl.DateTimeFormat("pt-BR", options);

	const defaultFormat: string = formatter.format(date);

	return defaultFormat.replace(", ", " às ");
};
