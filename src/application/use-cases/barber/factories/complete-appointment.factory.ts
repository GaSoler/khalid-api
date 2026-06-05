import { AppointmentRepository } from "@/infrastructure/database/appointment.repository.impl";
import type { DB } from "@/infrastructure/database/index";
import { CompleteAppointmentUseCase } from "../complete-appointment.use-case";

export function completeAppointmentFactory(db: DB) {
	const appointmentRepository = new AppointmentRepository(db);

	const completeAppointmentFactory = new CompleteAppointmentUseCase(
		appointmentRepository,
	);

	return completeAppointmentFactory;
}
