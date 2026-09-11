import type {
	AvailableTimesDTO,
	TimeSlot,
} from "@/domain/dtos/available-times.dto";
import type { IAppointmentRepository } from "@/domain/repositories/appointment.repository";
import type { IBarberAvailabilityRepository } from "@/domain/repositories/barber-availability.repository";
import { isSlotOccupied, minutesToTime, timeToMinutes } from "@/shared/utils";

interface GetBarberAvailableTimesUseCaseRequest {
	barberId: string;
	date: string;
	serviceDurationMin?: number;
}

interface GetBarberAvailableTimesUseCaseResponse {
	data: AvailableTimesDTO;
}

export class GetBarberAvailableTimesUseCase {
	private readonly BRAZIL_TIMEZONE_OFFSET_MINUTES = -180; // UTC-3

	constructor(
		private readonly barberAvailabilityRepository: IBarberAvailabilityRepository,
		private readonly appointmentRepository: IAppointmentRepository,
	) {}

	async execute({
		barberId,
		date,
		serviceDurationMin = 30,
	}: GetBarberAvailableTimesUseCaseRequest): Promise<GetBarberAvailableTimesUseCaseResponse> {
		const appointmentDate = new Date(date);
		const weekday = appointmentDate.getDay();

		const availabilitySlots =
			await this.barberAvailabilityRepository.findByBarberIdAndWeekday(
				barberId,
				weekday,
			);

		if (availabilitySlots.length === 0) {
			return {
				data: {
					timeSlots: [],
					date,
					barberId,
				},
			};
		}

		const appointments = await this.appointmentRepository.findByBarberIdAndDate(
			barberId,
			appointmentDate,
		);

		// Verifica se é hoje (compara strings de data)
		const now = new Date();
		const today = now.toISOString().split("T")[0];
		const isToday = date === today;

		// Converte UTC pra São Paulo (-3h = -180 min)
		const utcTimeInMinutes = now.getHours() * 60 + now.getMinutes();
		const localTimeInMinutes = isToday
			? utcTimeInMinutes + this.BRAZIL_TIMEZONE_OFFSET_MINUTES
			: -1;

		const SLOT_DURATION = 30;
		const timeSlots: TimeSlot[] = [];

		for (const slot of availabilitySlots) {
			const start = timeToMinutes(slot.startTime);
			const end = timeToMinutes(slot.endTime);

			for (
				let time = start;
				time + serviceDurationMin <= end;
				time += SLOT_DURATION
			) {
				// Se é hoje e horário já passou, pula
				const hasAlreadyPassed = isToday && time < localTimeInMinutes;
				if (hasAlreadyPassed) continue;

				const occupied = isSlotOccupied(time, appointments);
				if (occupied) continue; // Pula se ocupado

				// Só adiciona se está disponível
				timeSlots.push({
					time: minutesToTime(time),
					isAvailable: true,
				});
			}
		}

		return {
			data: {
				timeSlots,
				date,
				barberId,
			},
		};
	}
}
