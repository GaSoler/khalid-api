import type { DB } from "@/infrastructure/database";
import { AppointmentRepository } from "@/infrastructure/database/appointment.repository.impl";
import { GetNextAppointmentUseCase } from "../get-next-appointment.use-case";

export function getNextAppointmentFactory(db: DB) {
	const repository = new AppointmentRepository(db);
	return new GetNextAppointmentUseCase(repository);
}
