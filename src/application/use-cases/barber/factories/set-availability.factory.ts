import { BarberAvailabilityRepository } from "@/infrastructure/database/barber-availability.repository.impl";
import type { DB } from "@/infrastructure/database/index";
import { SetAvailabilityUseCase } from "../set-availability.use-case";

export function setAvailabilityFactory(db: DB) {
	const barberAvailabilityRepository = new BarberAvailabilityRepository(db);

	const setAvailabilityFactory = new SetAvailabilityUseCase(
		barberAvailabilityRepository,
	);

	return setAvailabilityFactory;
}
