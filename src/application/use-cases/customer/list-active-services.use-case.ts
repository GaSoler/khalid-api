import { type ServiceDTO, toServiceDTO } from "@/domain/dtos/service.dto";
import type { ServiceEntity } from "@/domain/entities/service.entity";
import type { IServiceRepository } from "@/domain/repositories/service.repository";
import type { PaginatedResult, PaginationParams } from "@/shared/types";

export class ListActiveServicesUseCase {
	constructor(private readonly serviceRepository: IServiceRepository) {}

	async execute(
		params: PaginationParams,
	): Promise<PaginatedResult<ServiceDTO>> {
		const services = await this.serviceRepository.findAll(params, {
			active: true,
		});

		return {
			...services,
			data: services.data.map((service: ServiceEntity) =>
				toServiceDTO(service),
			),
		};
	}
}
