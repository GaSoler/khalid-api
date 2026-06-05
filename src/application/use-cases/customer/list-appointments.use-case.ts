import type { AppointmentEntity } from "@/domain/entities/appointment.entity";
import type { IAppointmentRepository } from "@/domain/repositories/appointment.repository";

interface ListAppointmentsUseCaseRequest {
	customerId: string;
}

interface ListAppointmentsUseCaseResponse {
	data: AppointmentEntity[];
}

export class ListAppointmentsUseCase {
	constructor(private readonly appointmentRepository: IAppointmentRepository) {}

	async execute({
		customerId,
	}: ListAppointmentsUseCaseRequest): Promise<ListAppointmentsUseCaseResponse> {
		const appointments =
			await this.appointmentRepository.findAllByCustomerId(customerId);

		return { data: appointments };
	}
}
