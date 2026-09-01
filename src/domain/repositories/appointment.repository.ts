import type { AppointmentStatus } from "@/shared/types";
import type { AppointmentWithRelationsDTO } from "../dtos/appointment.dto";
import type { AppointmentEntity } from "../entities/appointment.entity";

export interface IAppointmentRepository {
	findAllByCustomerId: (customerId: string) => Promise<AppointmentEntity[]>;
	findAllByCustomerIdWithRelations: (
		customerId: string,
	) => Promise<AppointmentWithRelationsDTO[]>;
	findAllByBarberId: (barberId: string) => Promise<AppointmentEntity[]>;
	findById: (id: string) => Promise<AppointmentEntity | null>;
	findByIdWithRelations: (
		id: string,
	) => Promise<AppointmentWithRelationsDTO | null>;
	create: (data: {
		customerId: string;
		barberId: string;
		serviceId: string;
		startsAt: Date;
		endsAt: Date;
		status: AppointmentStatus;
		notes: string | null;
	}) => Promise<AppointmentEntity>;
	update: (id: string, status: AppointmentStatus) => Promise<AppointmentEntity>;
	findByBarberIdAndDate: (
		barberId: string,
		date: Date,
	) => Promise<AppointmentEntity[]>;
	findNextAppointment(
		barberId: string,
		afterDate: Date,
	): Promise<AppointmentEntity | null>;
	countByBarberAndDateRange(
		barberId: string,
		from: Date,
		to: Date,
	): Promise<number>;
	countUniqueCustomersByBarber(barberId: string): Promise<number>;
	findByBarberIdWithFilters(
		barberId: string,
		filters?: {
			status?: AppointmentStatus;
			from?: Date;
			to?: Date;
		},
	): Promise<AppointmentEntity[]>;
	findAllWithFilters(filters?: {
		customerId?: string;
		barberId?: string;
		serviceId?: string;
		status?: AppointmentStatus;
		from?: Date;
		to?: Date;
	}): Promise<AppointmentEntity[]>;
	findByCustomerIdAndStatus(
		customerId: string,
		status: AppointmentStatus,
	): Promise<AppointmentEntity[]>;
	findNextByCustomerId(
		customerId: string,
	): Promise<AppointmentWithRelationsDTO | null>;
}
