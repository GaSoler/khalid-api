import { and, eq, gte, lt, lte, notInArray, sql } from "drizzle-orm";
import type { IAppointmentRepository } from "@/domain/repositories/appointment.repository";
import type { AppointmentStatus } from "@/shared/types";
import type { DB } from ".";
import { appointments } from "./schema";

export class AppointmentRepository implements IAppointmentRepository {
	constructor(private readonly db: DB) {}

	async findAllByCustomerId(customerId: string) {
		return this.db
			.select()
			.from(appointments)
			.where(eq(appointments.customerId, customerId));
	}

	async findAllByBarberId(barberId: string) {
		return this.db
			.select()
			.from(appointments)
			.where(eq(appointments.barberId, barberId));
	}

	async findById(id: string) {
		const [appointment] = await this.db
			.select()
			.from(appointments)
			.where(eq(appointments.id, id));

		return appointment || null;
	}

	async create(data: {
		customerId: string;
		barberId: string;
		serviceId: string;
		startsAt: Date;
		endsAt: Date;
		status: AppointmentStatus;
		notes: string | null;
	}) {
		const [appointment] = await this.db
			.insert(appointments)
			.values({
				customerId: data.customerId,
				barberId: data.barberId,
				serviceId: data.serviceId,
				startsAt: data.startsAt,
				endsAt: data.endsAt,
				status: data.status,
				notes: data.notes,
			})
			.returning();

		return appointment;
	}

	async update(id: string, status: AppointmentStatus) {
		const [appointment] = await this.db
			.update(appointments)
			.set({ status })
			.where(eq(appointments.id, id))
			.returning();

		return appointment;
	}

	async findByBarberIdAndDate(barberId: string, date: Date) {
		const startOfDay = new Date(date);
		startOfDay.setUTCHours(0, 0, 0, 0);

		const endOfDay = new Date(date);
		endOfDay.setUTCHours(23, 59, 59, 999);

		const data = await this.db
			.select()
			.from(appointments)
			.where(
				and(
					eq(appointments.barberId, barberId),
					gte(appointments.startsAt, startOfDay),
					lt(appointments.startsAt, endOfDay),
				),
			);

		return data;
	}

	async findNextAppointment(barberId: string, afterDate: Date) {
		const [result] = await this.db
			.select({
				id: appointments.id,
				customerId: appointments.customerId,
				barberId: appointments.barberId,
				serviceId: appointments.serviceId,
				startsAt: appointments.startsAt,
				endsAt: appointments.endsAt,
				status: appointments.status,
				notes: appointments.notes,
				calendarEventId: appointments.calendarEventId,
				createdAt: appointments.createdAt,
				updatedAt: appointments.updatedAt,
			})
			.from(appointments)
			.where(
				and(
					eq(appointments.barberId, barberId),
					gte(appointments.startsAt, afterDate),
					notInArray(appointments.status, ["cancelled"]),
				),
			)
			.orderBy(appointments.startsAt)
			.limit(1);

		return result || null;
	}

	async countByBarberAndDateRange(barberId: string, from: Date, to: Date) {
		const [result] = await this.db
			.select({ count: sql<number>`count(*)` })
			.from(appointments)
			.where(
				and(
					eq(appointments.barberId, barberId),
					gte(appointments.startsAt, from),
					lte(appointments.startsAt, to),
					notInArray(appointments.status, ["cancelled"]),
				),
			);

		return result?.count || 0;
	}

	async countUniqueCustomersByBarber(barberId: string) {
		const [result] = await this.db
			.select({ count: sql<number>`count(distinct customer_id)` })
			.from(appointments)
			.where(
				and(
					eq(appointments.barberId, barberId),
					notInArray(appointments.status, ["cancelled"]),
				),
			);

		return result?.count || 0;
	}

	async findByBarberIdWithFilters(
		barberId: string,
		filters?: {
			status?: AppointmentStatus;
			from?: Date;
			to?: Date;
		},
	) {
		const conditions = [eq(appointments.barberId, barberId)];

		if (filters?.status) {
			conditions.push(eq(appointments.status, filters.status));
		}

		if (filters?.from) {
			conditions.push(gte(appointments.startsAt, filters.from));
		}

		if (filters?.to) {
			conditions.push(lte(appointments.startsAt, filters.to));
		}

		return this.db
			.select()
			.from(appointments)
			.where(and(...conditions))
			.orderBy(appointments.startsAt);
	}

	async findAllWithFilters(filters?: {
		customerId?: string;
		barberId?: string;
		serviceId?: string;
		status?: AppointmentStatus;
		from?: Date;
		to?: Date;
	}) {
		const conditions = [];

		if (filters?.customerId) {
			conditions.push(eq(appointments.customerId, filters.customerId));
		}

		if (filters?.barberId) {
			conditions.push(eq(appointments.barberId, filters.barberId));
		}

		if (filters?.serviceId) {
			conditions.push(eq(appointments.serviceId, filters.serviceId));
		}

		if (filters?.status) {
			conditions.push(eq(appointments.status, filters.status));
		}

		if (filters?.from) {
			conditions.push(gte(appointments.startsAt, filters.from));
		}

		if (filters?.to) {
			conditions.push(lte(appointments.startsAt, filters.to));
		}

		return this.db
			.select()
			.from(appointments)
			.where(and(...conditions))
			.orderBy(appointments.startsAt);
	}
}
