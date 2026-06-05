import type { ServiceEntity } from "@/domain/entities/service.entity";
import type { IServiceRepository } from "@/domain/repositories/service.repository";
import type { PaginatedResult, PaginationParams } from "@/shared/types";

export class ListActiveServicesUseCase {
	constructor(private readonly serviceRepository: IServiceRepository) {}

	async execute(
		params: PaginationParams,
	): Promise<PaginatedResult<ServiceEntity>> {
		return this.serviceRepository.findAll(params, { active: true });
	}
}
