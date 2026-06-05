import { AppointmentRepository } from "@/infrastructure/database/appointment.repository.impl";
import type { DB } from "@/infrastructure/database/index";
import { GetDashboardUseCase } from "../get-dashboard.use-case";

export function getDashboardFactory(db: DB) {
	const appointmentRepository = new AppointmentRepository(db);

	const getDashboardFactory = new GetDashboardUseCase(appointmentRepository);

	return getDashboardFactory;
}
