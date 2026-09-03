import type { AppointmentWithRelationsDTO } from "@/domain/dtos/appointment.dto";
import type { IAppointmentRepository } from "@/domain/repositories/appointment.repository";

interface GetDashboardUseCaseRequest {
	barberId: string;
}

interface GetDashboardUseCaseResponse {
	data: {
		nextAppointment: AppointmentWithRelationsDTO | null;
		appointmentsToday: number;
		appointmentsThisWeek: number;
		totalClientsServed: number;
	};
}

export class GetDashboardUseCase {
	constructor(private readonly appointmentRepository: IAppointmentRepository) {}

	async execute({
		barberId,
	}: GetDashboardUseCaseRequest): Promise<GetDashboardUseCaseResponse> {
		const now = new Date();
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		const weekStart = new Date(today);
		weekStart.setDate(today.getDate() - today.getDay()); // Domingo da semana
		const weekEnd = new Date(weekStart);
		weekEnd.setDate(weekStart.getDate() + 6); // Sábado

		// Próximo agendamento
		const nextAppointment =
			await this.appointmentRepository.findNextAppointment(barberId, now);

		// Agendamentos hoje
		const appointmentsToday =
			await this.appointmentRepository.countByBarberAndDateRange(
				barberId,
				today,
				new Date(today.getTime() + 24 * 60 * 60 * 1000),
			);

		// Agendamentos esta semana
		const appointmentsThisWeek =
			await this.appointmentRepository.countByBarberAndDateRange(
				barberId,
				weekStart,
				weekEnd,
			);

		// Total de clientes únicos atendidos
		const totalClientsServed =
			await this.appointmentRepository.countUniqueCustomersByBarber(barberId);

		return {
			data: {
				nextAppointment: nextAppointment ? nextAppointment : null,
				appointmentsToday,
				appointmentsThisWeek,
				totalClientsServed,
			},
		};
	}
}
