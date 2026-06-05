import type { AppointmentStatus } from "@/shared/types";

export interface AppointmentEntity {
	id: string;
	customerId: string;
	barberId: string;
	serviceId: string;
	startsAt: Date;
	endsAt: Date;
	status: AppointmentStatus;
	notes: string | null;
	calendarEventId: string | null;
	createdAt: Date;
	updatedAt: Date;
}
