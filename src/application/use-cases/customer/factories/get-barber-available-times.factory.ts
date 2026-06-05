import type { DB } from "@/infrastructure/database";
import { AppointmentRepository } from "@/infrastructure/database/appointment.repository.impl";
import { BarberAvailabilityRepository } from "@/infrastructure/database/barber-availability.repository.impl";
import { GetBarberAvailableTimesUseCase } from "../get-barber-available-times.use-case";

export function getBarberAvailableTimesFactory(db: DB) {
	const barberAvailabilityRepository = new BarberAvailabilityRepository(db);
	const appointmentRepository = new AppointmentRepository(db);

	const getBarberAvailableTimesFactory = new GetBarberAvailableTimesUseCase(
		barberAvailabilityRepository,
		appointmentRepository,
	);

	return getBarberAvailableTimesFactory;
}
