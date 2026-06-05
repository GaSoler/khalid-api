import type { ServiceEntity } from "@/domain/entities/service.entity";
import type { IServiceRepository } from "@/domain/repositories/service.repository";
import { NotFoundError } from "@/shared/errors";

interface UpdateServiceUseCaseRequest {
	serviceId: string;
	name?: string;
	description?: string;
	priceBRL?: number;
	durationMinutes?: number;
	active?: boolean;
}

interface UpdateServiceUseCaseResponse {
	data: ServiceEntity;
}

export class UpdateServiceUseCase {
	constructor(private readonly serviceRepository: IServiceRepository) {}

	async execute({
		serviceId,
		name,
		description,
		priceBRL,
		durationMinutes,
		active,
	}: UpdateServiceUseCaseRequest): Promise<UpdateServiceUseCaseResponse> {
		const service = await this.serviceRepository.findById(serviceId);

		if (!service) {
			throw new NotFoundError("Service");
		}

		// Constrói objeto de atualização com apenas os campos enviados
		const updateData: any = {};

		if (name !== undefined) {
			updateData.name = name;
		}

		if (description !== undefined) {
			updateData.description = description;
		}

		if (priceBRL !== undefined) {
			updateData.priceCents = Math.round(priceBRL * 100);

			if (updateData.priceCents <= 0) {
				throw new Error("Price must be greater than 0");
			}
		}

		if (durationMinutes !== undefined) {
			if (durationMinutes < 15 || durationMinutes > 240) {
				throw new Error("Duration must be between 15 and 240 minutes");
			}
			updateData.durationMin = durationMinutes;
		}

		if (active !== undefined) {
			updateData.active = active;
		}

		const updated = await this.serviceRepository.update(serviceId, updateData);

		return { data: updated };
	}
}
