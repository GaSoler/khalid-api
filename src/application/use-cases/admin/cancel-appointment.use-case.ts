import type { AppointmentEntity } from "@/domain/entities/appointment.entity";
import type { IAppointmentRepository } from "@/domain/repositories/appointment.repository";
import { ConflictError, NotFoundError } from "@/shared/errors";

interface CancelAppointmentUseCaseRequest {
	appointmentId: string;
}

interface CancelAppointmentUseCaseResponse {
	data: AppointmentEntity;
}

export class CancelAppointmentUseCase {
	constructor(private readonly appointmentRepository: IAppointmentRepository) {}

	async execute({
		appointmentId,
	}: CancelAppointmentUseCaseRequest): Promise<CancelAppointmentUseCaseResponse> {
		const appointment =
			await this.appointmentRepository.findById(appointmentId);

		if (!appointment) {
			throw new NotFoundError("Appointment");
		}

		if (appointment.status === "cancelled") {
			throw new ConflictError("Appointment already cancelled");
		}

		const updated = await this.appointmentRepository.update(
			appointmentId,
			"cancelled",
		);

		return { data: updated };
	}
}
