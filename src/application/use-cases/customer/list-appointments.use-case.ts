import type { AppointmentWithRelationsDTO } from "@/domain/dtos/appointment.dto";
import type { IAppointmentRepository } from "@/domain/repositories/appointment.repository";

interface ListAppointmentsUseCaseRequest {
	customerId: string;
}

interface ListAppointmentsUseCaseResponse {
	data: AppointmentWithRelationsDTO[];
}

export class ListAppointmentsUseCase {
	constructor(private readonly appointmentRepository: IAppointmentRepository) {}

	async execute({
		customerId,
	}: ListAppointmentsUseCaseRequest): Promise<ListAppointmentsUseCaseResponse> {
		const appointments =
			await this.appointmentRepository.findAllByCustomerIdWithRelations(
				customerId,
			);

		return { data: appointments };
	}
}
