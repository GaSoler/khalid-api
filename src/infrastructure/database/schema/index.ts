import { sql } from "drizzle-orm";
import {
	boolean,
	index,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";

// Enums
export const userRoleEnum = pgEnum("user_role", [
	"customer",
	"barber",
	"admin",
]);
export const appointmentStatusEnum = pgEnum("appointment_status", [
	"scheduled",
	"cancelled",
	"completed",
]);

// Tables
export const users = pgTable(
	"users",
	{
		id: uuid("id").primaryKey(),
		email: text("email").notNull().unique(),
		fullName: text("full_name"),
		avatarUrl: text("avatar_url"),
		roles: userRoleEnum("roles")
			.array()
			.notNull()
			.default(sql`ARRAY['customer'::user_role]`),
		createdAt: timestamp("created_at").notNull().default(sql`now()`),
		updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
	},
	(table) => ({
		rolesIdx: index("idx_users_roles").using("gin", sql`${table.roles}`),
	}),
);

export const services = pgTable(
	"services",
	{
		id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
		name: text("name").notNull(),
		description: text("description"),
		durationMin: integer("duration_min").notNull(),
		priceCents: integer("price_cents").notNull(),
		active: boolean("active").notNull().default(true),
		createdAt: timestamp("created_at").notNull().default(sql`now()`),
		updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
	},
	(table) => ({
		activeIdx: index("idx_services_active").on(table.active),
	}),
);

export const barberAvailability = pgTable(
	"barber_availability",
	{
		id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
		barberId: uuid("barber_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		weekday: integer("weekday").notNull(),
		startTime: text("start_time").notNull(), // "HH:MM"
		endTime: text("end_time").notNull(), // "HH:MM"
		createdAt: timestamp("created_at").notNull().default(sql`now()`),
	},
	(table) => ({
		barberId_weekday: uniqueIndex(
			"barber_availability_barber_id_weekday_idx",
		).on(table.barberId, table.weekday),
	}),
);

export const appointments = pgTable(
	"appointments",
	{
		id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
		customerId: uuid("customer_id")
			.notNull()
			.references(() => users.id),
		barberId: uuid("barber_id")
			.notNull()
			.references(() => users.id),
		serviceId: uuid("service_id")
			.notNull()
			.references(() => services.id),
		startsAt: timestamp("starts_at").notNull(),
		endsAt: timestamp("ends_at").notNull(),
		status: appointmentStatusEnum("status").notNull().default("scheduled"),
		notes: text("notes"),
		calendarEventId: text("calendar_event_id"),
		createdAt: timestamp("created_at").notNull().default(sql`now()`),
		updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
	},
	(table) => ({
		customerIdx: index("idx_appointments_customer_id").on(table.customerId),
		barberIdx: index("idx_appointments_barber_id").on(table.barberId),
		startsAtIdx: index("idx_appointments_starts_at").on(table.startsAt),
		statusIdx: index("idx_appointments_status").on(table.status),
		barberTimeIdx: index("idx_appointments_barber_time").on(
			table.barberId,
			table.startsAt,
			table.endsAt,
		),
	}),
);

// Types
export type User = typeof users.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Appointment = typeof appointments.$inferSelect;
export type BarberAvailability = typeof barberAvailability.$inferSelect;
