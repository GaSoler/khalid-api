import type { BarberAvailabilityEntity } from "../entities/barber-availability.entity";

export interface IBarberAvailabilityRepository {
	findAllByBarberId(barberId: string): Promise<BarberAvailabilityEntity[]>;
	findByBarberIdAndWeekday(
		barberId: string,
		weekday: number,
	): Promise<BarberAvailabilityEntity[]>;
	replaceAll(
		barberId: string,
		slots: {
			weekday: number;
			startTime: string;
			endTime: string;
		}[],
	): Promise<BarberAvailabilityEntity[]>;
}
