import type { AppointmentWithRelationsDTO } from "@/domain/dtos/appointment.dto";
import type { IAppointmentRepository } from "@/domain/repositories/appointment.repository";
import { ConflictError, NotFoundError } from "@/shared/errors";

interface CompleteAppointmentUseCaseRequest {
	appointmentId: string;
	barberId: string;
}

interface CompleteAppointmentUseCaseResponse {
	data: AppointmentWithRelationsDTO;
}

export class CompleteAppointmentUseCase {
	constructor(private readonly appointmentRepository: IAppointmentRepository) {}

	async execute({
		appointmentId,
		barberId,
	}: CompleteAppointmentUseCaseRequest): Promise<CompleteAppointmentUseCaseResponse> {
		const appointment =
			await this.appointmentRepository.findByIdWithRelations(appointmentId);

		if (!appointment) {
			throw new NotFoundError("Agendamento não encontrado.");
		}

		if (appointment.barber.id !== barberId) {
			throw new ConflictError("Este agendamento pertence a outro barbeiro.");
		}

		if (appointment.status !== "scheduled") {
			throw new ConflictError(
				"Não é possível finalizar um agendamento que foi cancelado ou finalizado anteriormente.",
			);
		}

		const updated = await this.appointmentRepository.updateWithRelations(
			appointmentId,
			"completed",
		);

		return { data: updated };
	}
}
