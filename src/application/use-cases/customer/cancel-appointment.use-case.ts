import type { AppointmentEntity } from "@/domain/entities/appointment.entity";
import type { IAppointmentRepository } from "@/domain/repositories/appointment.repository";
import { ConflictError, NotFoundError } from "@/shared/errors";

interface CancelAppointmentUseCaseRequest {
	appointmentId: string;
	customerId: string;
}

interface CancelAppointmentUseCaseResponse {
	data: AppointmentEntity;
}

export class CancelAppointmentUseCase {
	constructor(private readonly appointmentRepository: IAppointmentRepository) {}

	async execute({
		appointmentId,
		customerId,
	}: CancelAppointmentUseCaseRequest): Promise<CancelAppointmentUseCaseResponse> {
		const appointment =
			await this.appointmentRepository.findById(appointmentId);

		if (!appointment) {
			throw new NotFoundError(
				"Não foi encontrado agendamento com o ID fornecido",
			);
		}

		if (appointment.customerId !== customerId) {
			throw new NotFoundError(
				"Somente o proprietário do agendamento pode cancelá-lo",
			);
		}

		if (appointment.status === "cancelled") {
			throw new ConflictError("Agendamento já está cancelado");
		}

		const appointmentDate = new Date(appointment.startsAt);
		const now = new Date();

		const diffInMs = appointmentDate.getTime() - now.getTime();
		const diffInHours = diffInMs / (1000 * 60 * 60);

		if (diffInHours < 4) {
			throw new ConflictError(
				"Agendamentos só podem ser cancelados com pelo menos 4 horas de antecedência",
			);
		}

		const updated = await this.appointmentRepository.update(
			appointmentId,
			"cancelled",
		);

		return { data: updated };
	}
}
