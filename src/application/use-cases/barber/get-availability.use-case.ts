import type { IBarberAvailabilityRepository } from "@/domain/repositories/barber-availability.repository";

interface GetAvailabilityUseCaseRequest {
	barberId: string;
}

interface AvailabilityBlock {
	id: string;
	start: string;
	end: string;
}

interface AvailabilityDay {
	weekday: number;
	name: string;
	enabled: boolean;
	blocks: AvailabilityBlock[];
}

interface GetAvailabilityUseCaseResponse {
	data: AvailabilityDay[];
}

export class GetAvailabilityUseCase {
	private readonly DAY_NAMES = [
		"Domingo",
		"Segunda",
		"Terça",
		"Quarta",
		"Quinta",
		"Sexta",
		"Sábado",
	];

	constructor(
		private readonly barberAvailabilityRepository: IBarberAvailabilityRepository,
	) {}

	async execute({
		barberId,
	}: GetAvailabilityUseCaseRequest): Promise<GetAvailabilityUseCaseResponse> {
		const availability =
			await this.barberAvailabilityRepository.findAllByBarberId(barberId);

		const days: AvailabilityDay[] = Array.from({ length: 7 }, (_, i) => ({
			weekday: i,
			name: this.DAY_NAMES[i],
			enabled: false,
			blocks: [],
		}));

		for (const slot of availability) {
			const day = days[slot.weekday];
			day.enabled = true;
			day.blocks.push({
				id: slot.id,
				start: slot.startTime,
				end: slot.endTime,
			});
		}

		days.forEach((day) => {
			day.blocks.sort((a, b) => a.start.localeCompare(b.start));
		});

		return { data: days };
	}
}
