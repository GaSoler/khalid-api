import type { AppointmentEntity } from "@/domain/entities/appointment.entity";
import type { IAppointmentRepository } from "@/domain/repositories/appointment.repository";
import type { AppointmentStatus } from "@/shared/types";

interface ListAppointmentsUseCaseRequest {
	barberId: string;
	status?: AppointmentStatus;
	from?: Date;
	to?: Date;
}

interface ListAppointmentsUseCaseResponse {
	data: AppointmentEntity[];
}

export class ListAppointmentsUseCase {
	constructor(private readonly appointmentRepository: IAppointmentRepository) {}

	async execute({
		barberId,
		status,
		from,
		to,
	}: ListAppointmentsUseCaseRequest): Promise<ListAppointmentsUseCaseResponse> {
		let adjustedFrom = from;
		let adjustedTo = to;

		if (adjustedFrom) {
			adjustedFrom = new Date(
				Date.UTC(
					adjustedFrom.getUTCFullYear(),
					adjustedFrom.getUTCMonth(),
					adjustedFrom.getUTCDate(),
					0,
					0,
					0,
					0,
				),
			);
		}

		if (adjustedTo) {
			adjustedTo = new Date(
				Date.UTC(
					adjustedTo.getUTCFullYear(),
					adjustedTo.getUTCMonth(),
					adjustedTo.getUTCDate(),
					23,
					59,
					59,
					999,
				),
			);
		}
		const appointments =
			await this.appointmentRepository.findByBarberIdWithFilters(barberId, {
				status,
				from: adjustedFrom,
				to: adjustedTo,
			});

		return { data: appointments };
	}
}
