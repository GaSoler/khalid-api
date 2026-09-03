import type { BarberAvailabilityEntity } from "@/domain/entities/barber-availability.entity";
import type { IBarberAvailabilityRepository } from "@/domain/repositories/barber-availability.repository";
import { ConflictError, ValidationError } from "@/shared/errors";
import { timeToMinutes } from "@/shared/utils";

interface SetAvailabilityUseCaseRequest {
	barberId: string;
	availabilities: {
		weekday: number;
		startTime: string;
		endTime: string;
	}[];
}

interface SetAvailabilityUseCaseResponse {
	data: BarberAvailabilityEntity[];
}

export class SetAvailabilityUseCase {
	constructor(
		private readonly barberAvailabilityRepository: IBarberAvailabilityRepository,
	) {}

	async execute({
		barberId,
		availabilities,
	}: SetAvailabilityUseCaseRequest): Promise<SetAvailabilityUseCaseResponse> {
		// Valida slots
		availabilities.forEach((availability, index) => {
			const startMinutes = timeToMinutes(availability.startTime);
			const endMinutes = timeToMinutes(availability.endTime);

			if (startMinutes >= endMinutes) {
				throw new ValidationError(
					`Slot ${index + 1}: Horário de início (${availability.startTime}) deve ser menor que horário de fim (${availability.endTime})`,
				);
			}

			// 2. Valida se não há sobreposição com outros slots do mesmo dia
			availabilities.forEach((other, otherIndex) => {
				if (index === otherIndex) return; // Não comparar com ele mesmo

				if (availability.weekday === other.weekday) {
					const otherStartMinutes = timeToMinutes(other.startTime);
					const otherEndMinutes = timeToMinutes(other.endTime);

					// Verifica overlap
					if (
						!(
							endMinutes <= otherStartMinutes || startMinutes >= otherEndMinutes
						)
					) {
						throw new ConflictError(
							`Slots do dia ${availability.weekday} se sobrepõem: ${availability.startTime}-${availability.endTime} e ${other.startTime}-${other.endTime}`,
						);
					}
				}
			});
		});

		const availability = await this.barberAvailabilityRepository.replaceAll(
			barberId,
			availabilities,
		);

		return { data: availability };
	}
}
