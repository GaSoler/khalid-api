import type { AppointmentEntity } from "@/domain/entities/appointment.entity";
import type { IAppointmentRepository } from "@/domain/repositories/appointment.repository";

interface GetNextAppointmentUseCaseRequest {
	customerId: string;
}

interface GetNextAppointmentUseCaseResponse {
	data: AppointmentEntity | null;
}

export class GetNextAppointmentUseCase {
	constructor(private readonly appointmentRepository: IAppointmentRepository) {}

	async execute({
		customerId,
	}: GetNextAppointmentUseCaseRequest): Promise<GetNextAppointmentUseCaseResponse> {
		const appointment =
			await this.appointmentRepository.findNextByCustomerId(customerId);

		return { data: appointment };
	}
}
