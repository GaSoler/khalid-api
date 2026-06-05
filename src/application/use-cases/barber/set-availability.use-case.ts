// src/application/use-cases/barber/set-barber-availability.use-case.ts
import type { BarberAvailabilityEntity } from "@/domain/entities/barber-availability.entity";
import type { IBarberAvailabilityRepository } from "@/domain/repositories/barber-availability.repository";
import { ConflictError } from "@/shared/errors";

interface SetAvailabilityUseCaseRequest {
	barberId: string;
	slots: {
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
		slots,
	}: SetAvailabilityUseCaseRequest): Promise<SetAvailabilityUseCaseResponse> {
		// Valida slots
		for (const slot of slots) {
			if (slot.weekday < 0 || slot.weekday > 6) {
				throw new ConflictError("Weekday deve estar entre 0-6");
			}

			if (slot.endTime <= slot.startTime) {
				throw new ConflictError("End time deve ser maior que start time");
			}
		}

		const availability = await this.barberAvailabilityRepository.replaceAll(
			barberId,
			slots,
		);

		return { data: availability };
	}
}
