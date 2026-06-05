import type { AppointmentEntity } from "@/domain/entities/appointment.entity";
import type { IAppointmentRepository } from "@/domain/repositories/appointment.repository";
import { ConflictError, NotFoundError } from "@/shared/errors";

interface CompleteAppointmentUseCaseRequest {
	appointmentId: string;
	barberId: string;
}

interface CompleteAppointmentUseCaseResponse {
	data: AppointmentEntity;
}

export class CompleteAppointmentUseCase {
	constructor(private readonly appointmentRepository: IAppointmentRepository) {}

	async execute({
		appointmentId,
		barberId,
	}: CompleteAppointmentUseCaseRequest): Promise<CompleteAppointmentUseCaseResponse> {
		const appointment =
			await this.appointmentRepository.findById(appointmentId);

		if (!appointment) {
			throw new NotFoundError("Appointment");
		}

		if (appointment.barberId !== barberId) {
			throw new NotFoundError("Appointment");
		}

		if (appointment.status === "completed") {
			throw new ConflictError("Appointment already completed");
		}

		const updated = await this.appointmentRepository.update(
			appointmentId,
			"completed",
		);

		return { data: updated };
	}
}
