import { AppointmentRepository } from "@/infrastructure/database/appointment.repository.impl";
import type { DB } from "@/infrastructure/database/index";
import { ListAppointmentsUseCase } from "../list-appointments.use-case";

export function listAppointmentsFactory(db: DB) {
	const appointmentRepository = new AppointmentRepository(db);

	const listAppointmentsFactory = new ListAppointmentsUseCase(
		appointmentRepository,
	);

	return listAppointmentsFactory;
}
