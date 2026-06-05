import type { ServiceEntity } from "@/domain/entities/service.entity";
import type { IServiceRepository } from "@/domain/repositories/service.repository";
import { ConflictError } from "@/shared/errors";

interface CreateServiceUseCaseRequest {
	name: string;
	description?: string;
	priceBRL: number;
	durationMin: number;
}

interface CreateServiceUseCaseResponse {
	data: ServiceEntity;
}

export class CreateServiceUseCase {
	constructor(private readonly serviceRepository: IServiceRepository) {}

	async execute({
		name,
		description,
		priceBRL,
		durationMin,
	}: CreateServiceUseCaseRequest): Promise<CreateServiceUseCaseResponse> {
		const priceCents = Math.round(priceBRL * 100);

		if (priceCents <= 0) {
			throw new ConflictError("Price must be greater than 0");
		}

		if (durationMin < 15 || durationMin > 240) {
			throw new ConflictError("Duration must be between 15 and 240 minutes");
		}

		const service = await this.serviceRepository.create({
			name,
			description,
			priceCents,
			durationMin,
		});

		return { data: service };
	}
}
