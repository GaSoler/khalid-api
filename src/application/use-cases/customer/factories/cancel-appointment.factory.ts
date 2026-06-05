import { AppointmentRepository } from "@/infrastructure/database/appointment.repository.impl";
import type { DB } from "@/infrastructure/database/index";
import { CancelAppointmentUseCase } from "../cancel-appointment.use-case";

export function cancelAppointmentFactory(db: DB) {
	const appointmentRepository = new AppointmentRepository(db);

	const cancelAppointmentFactory = new CancelAppointmentUseCase(
		appointmentRepository,
	);

	return cancelAppointmentFactory;
}
