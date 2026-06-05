import { AppointmentRepository } from "@/infrastructure/database/appointment.repository.impl";
import { BarberAvailabilityRepository } from "@/infrastructure/database/barber-availability.repository.impl";
import type { DB } from "@/infrastructure/database/index";
import { ServiceRepository } from "@/infrastructure/database/service.repository.impl";
import { CreateAppointmentUseCase } from "../create-appointment.use-case";

export function createAppointmentFactory(db: DB) {
	const appointmentRepository = new AppointmentRepository(db);
	const serviceRepository = new ServiceRepository(db);
	const barberAvailabilityRepository = new BarberAvailabilityRepository(db);

	const createAppointmentFactory = new CreateAppointmentUseCase(
		appointmentRepository,
		serviceRepository,
		barberAvailabilityRepository,
	);

	return createAppointmentFactory;
}
