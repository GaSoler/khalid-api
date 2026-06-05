import type { BarberAvailabilityEntity } from "@/domain/entities/barber-availability.entity";
import type { IBarberAvailabilityRepository } from "@/domain/repositories/barber-availability.repository";

interface GetAvailabilityUseCaseRequest {
	barberId: string;
}

interface GetAvailabilityUseCaseResponse {
	data: BarberAvailabilityEntity[];
}

export class GetAvailabilityUseCase {
	constructor(
		private readonly barberAvailabilityRepository: IBarberAvailabilityRepository,
	) {}

	async execute({
		barberId,
	}: GetAvailabilityUseCaseRequest): Promise<GetAvailabilityUseCaseResponse> {
		const availability =
			await this.barberAvailabilityRepository.findAllByBarberId(barberId);

		return { data: availability };
	}
}
