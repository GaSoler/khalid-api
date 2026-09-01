import type { AppointmentStatus } from "@/shared/types";
import type { AppointmentEntity } from "../entities/appointment.entity";

export interface AppointmentDTO {
	id: string;
	customerId: string;
	barberId: string;
	serviceId: string;
	startsAt: Date;
	endsAt: Date;
	status: AppointmentStatus;
	notes: string | null;
	calendarEventId: string | null;
}

export interface AppointmentWithRelationsDTO {
	id: string;
	customer: {
		id: string;
		email: string;
		fullName: string | null;
		avatarUrl: string | null;
	};
	barber: {
		id: string;
		email: string;
		fullName: string | null;
		avatarUrl: string | null;
	};
	service: {
		id: string;
		name: string;
		description: string | null;
		durationMin: number;
		priceCents: number;
		active: boolean;
	};
	startsAt: Date;
	endsAt: Date;
	status: AppointmentStatus;
	notes: string | null;
	calendarEventId: string | null;
}

export function toAppointmentDTO(entity: AppointmentEntity): AppointmentDTO {
	return {
		id: entity.id,
		customerId: entity.customerId,
		barberId: entity.barberId,
		serviceId: entity.serviceId,
		startsAt: entity.startsAt,
		endsAt: entity.endsAt,
		status: entity.status,
		notes: entity.notes,
		calendarEventId: entity.calendarEventId,
	};
}
