import type { AppointmentEntity } from "@/domain/entities/appointment.entity";
import type { IAppointmentRepository } from "@/domain/repositories/appointment.repository";
import { NotFoundError } from "@/shared/errors";

interface GetAppointmentUseCaseRequest {
	appointmentId: string;
	customerId: string;
}

interface GetAppointmentUseCaseResponse {
	data: AppointmentEntity;
}

export class GetAppointmentUseCase {
	constructor(private readonly appointmentRepository: IAppointmentRepository) {}

	async execute({
		appointmentId,
		customerId,
	}: GetAppointmentUseCaseRequest): Promise<GetAppointmentUseCaseResponse> {
		const appointment =
			await this.appointmentRepository.findById(appointmentId);

		if (!appointment) {
			throw new NotFoundError("Appointment");
		}

		if (appointment.customerId !== customerId) {
			throw new NotFoundError("Appointment");
		}

		return { data: appointment };
	}
}
