import type { AppointmentWithRelationsDTO } from "@/domain/dtos/appointment.dto";
import type { IAppointmentRepository } from "@/domain/repositories/appointment.repository";
import { NotFoundError } from "@/shared/errors";

interface GetAppointmentUseCaseRequest {
	appointmentId: string;
	customerId: string;
}

interface GetAppointmentUseCaseResponse {
	data: AppointmentWithRelationsDTO;
}

export class GetAppointmentUseCase {
	constructor(private readonly appointmentRepository: IAppointmentRepository) {}

	async execute({
		appointmentId,
		customerId,
	}: GetAppointmentUseCaseRequest): Promise<GetAppointmentUseCaseResponse> {
		const appointment =
			await this.appointmentRepository.findByIdWithRelations(appointmentId);

		if (!appointment) {
			throw new NotFoundError("Appointment");
		}

		if (appointment.customer.id !== customerId) {
			throw new NotFoundError("Appointment");
		}

		return { data: appointment };
	}
}
