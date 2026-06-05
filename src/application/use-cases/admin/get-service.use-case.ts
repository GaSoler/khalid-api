import type { AppointmentEntity } from "@/domain/entities/appointment.entity";
import type { ServiceEntity } from "@/domain/entities/service.entity";
import type { IAppointmentRepository } from "@/domain/repositories/appointment.repository";
import type { IServiceRepository } from "@/domain/repositories/service.repository";
import { NotFoundError } from "@/shared/errors";

interface GetServiceUseCaseRequest {
	serviceId: string;
}

interface GetServiceUseCaseResponse {
	data: ServiceEntity;
}

export class GetServiceUseCase {
	constructor(private readonly serviceRepository: IServiceRepository) {}

	async execute({
		serviceId,
	}: GetServiceUseCaseRequest): Promise<GetServiceUseCaseResponse> {
		const service = await this.serviceRepository.findById(serviceId);

		if (!service) {
			throw new NotFoundError("Service");
		}

		return { data: service };
	}
}
