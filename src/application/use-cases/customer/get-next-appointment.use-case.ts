import type { AppointmentWithRelationsDTO } from "@/domain/dtos/appointment.dto";
import type { IAppointmentRepository } from "@/domain/repositories/appointment.repository";

interface GetNextAppointmentUseCaseRequest {
	customerId: string;
}

interface GetNextAppointmentUseCaseResponse {
	data: AppointmentWithRelationsDTO | null;
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
