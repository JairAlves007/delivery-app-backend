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
