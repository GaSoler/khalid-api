import type { IServiceRepository } from "@/domain/repositories/service.repository";
import { NotFoundError } from "@/shared/errors";

interface DeleteServiceUseCaseRequest {
	serviceId: string;
}

interface DeleteServiceUseCaseResponse {
	message: string;
}

export class DeleteServiceUseCase {
	constructor(private readonly serviceRepository: IServiceRepository) {}

	async execute({
		serviceId,
	}: DeleteServiceUseCaseRequest): Promise<DeleteServiceUseCaseResponse> {
		const service = await this.serviceRepository.findById(serviceId);

		if (!service) {
			throw new NotFoundError("Service");
		}

		await this.serviceRepository.delete(serviceId);

		return { message: "Service deleted successfully" };
	}
}
