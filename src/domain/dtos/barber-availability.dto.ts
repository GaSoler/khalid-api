import type { BarberAvailabilityEntity } from "../entities/barber-availability.entity";

export interface BarberAvailabilityDTO {
	id: string;
	barberId: string;
	weekday: number;
	startTime: string;
	endTime: string;
}

export function toBarberAvailabilityDTO(
	entity: BarberAvailabilityEntity,
): BarberAvailabilityDTO {
	return {
		id: entity.id,
		barberId: entity.barberId,
		weekday: entity.weekday,
		startTime: entity.startTime,
		endTime: entity.endTime,
	};
}
