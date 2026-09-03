import type { AppointmentWithRelationsDTO } from "@/domain/dtos/appointment.dto";
import type { IAppointmentRepository } from "@/domain/repositories/appointment.repository";
import { ConflictError, NotFoundError } from "@/shared/errors";

interface GetAppointmentUseCaseRequest {
	appointmentId: string;
	barberId: string;
}

interface GetAppointmentUseCaseResponse {
	data: AppointmentWithRelationsDTO;
}

export class GetAppointmentUseCase {
	constructor(private readonly appointmentRepository: IAppointmentRepository) {}

	async execute({
		appointmentId,
		barberId,
	}: GetAppointmentUseCaseRequest): Promise<GetAppointmentUseCaseResponse> {
		const appointment =
			await this.appointmentRepository.findByIdWithRelations(appointmentId);

		if (!appointment) {
			throw new NotFoundError("Agendamento não encontrado.");
		}

		if (appointment.barber.id !== barberId) {
			throw new ConflictError("Este agendamento pertence a outro barbeiro.");
		}

		return { data: appointment };
	}
}
