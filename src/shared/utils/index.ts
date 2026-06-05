import type { PaginatedResult, PaginationParams } from "../types/index.js";

export function paginate<T>(
	data: T[],
	total: number,
	params: PaginationParams,
): PaginatedResult<T> {
	const page = Math.max(1, params.page ?? 1);
	const limit = Math.min(100, Math.max(1, params.limit ?? 20));

	return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export function paginationOffset(params: PaginationParams) {
	const page = Math.max(1, params.page ?? 1);
	const limit = Math.min(100, Math.max(1, params.limit ?? 20));
	return { limit, offset: (page - 1) * limit };
}

export function timeToMinutes(time: string) {
	const [h, m] = time.split(":").map(Number);
	return h * 60 + m;
}

export function minutesToTime(minutes: number) {
	const h = Math.floor(minutes / 60)
		.toString()
		.padStart(2, "0");

	const m = (minutes % 60).toString().padStart(2, "0");

	return `${h}:${m}`;
}

export function isSlotOccupied(
	slotMinutes: number,
	appointments: { startsAt: Date; endsAt: Date }[],
) {
	return appointments.some((appt) => {
		const start =
			appt.startsAt.getUTCHours() * 60 + appt.startsAt.getUTCMinutes();

		const end = appt.endsAt.getUTCHours() * 60 + appt.endsAt.getUTCMinutes();

		return slotMinutes >= start && slotMinutes < end;
	});
}

export function isSlotOccupiedWithDuration(
	slotMinutes: number,
	slotDurationMinutes: number,
	appointments: { startsAt: Date; endsAt: Date }[],
) {
	const slotEnd = slotMinutes + slotDurationMinutes;

	return appointments.some((appt) => {
		const start =
			appt.startsAt.getUTCHours() * 60 + appt.startsAt.getUTCMinutes();
		const end = appt.endsAt.getUTCHours() * 60 + appt.endsAt.getUTCMinutes();

		return slotMinutes < end && slotEnd > start;
	});
}
