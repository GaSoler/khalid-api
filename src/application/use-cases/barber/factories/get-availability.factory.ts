import { BarberAvailabilityRepository } from "@/infrastructure/database/barber-availability.repository.impl";
import type { DB } from "@/infrastructure/database/index";
import { GetAvailabilityUseCase } from "../get-availability.use-case";

export function getAvailabilityFactory(db: DB) {
	const barberAvailabilityRepository = new BarberAvailabilityRepository(db);

	const getAvailabilityFactory = new GetAvailabilityUseCase(
		barberAvailabilityRepository,
	);

	return getAvailabilityFactory;
}
