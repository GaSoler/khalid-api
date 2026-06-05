import type { DB } from "@/infrastructure/database";
import { AppointmentRepository } from "@/infrastructure/database/appointment.repository.impl";
import { GetAppointmentUseCase } from "../get-appointment.use-case";

export function getAppointmentFactory(db: DB) {
	const appointmentRepository = new AppointmentRepository(db);

	const getAppointmentFactory = new GetAppointmentUseCase(
		appointmentRepository,
	);

	return getAppointmentFactory;
}
