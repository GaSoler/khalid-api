import type { IAppointmentRepository } from "@/domain/repositories/appointment.repository";
import type { IBarberAvailabilityRepository } from "@/domain/repositories/barber-availability.repository";
import { isSlotOccupied, minutesToTime, timeToMinutes } from "@/shared/utils";

interface GetBarberAvailableTimesUseCaseRequest {
	barberId: string;
	date: Date;
	serviceDurationMin?: number;
}

interface TimeSlot {
	time: string;
	isAvailable: boolean;
}

// interface GetBarberAvailableTimesUseCaseResponse {
// 	data: { timeSlots: TimeSlot[] };
// }

interface GetBarberAvailableTimesUseCaseResponse {
	data: {
		timeSlots: TimeSlot[];
		date: string;
		barberId: string;
	};
}

export class GetBarberAvailableTimesUseCase {
	constructor(
		private readonly barberAvailabilityRepository: IBarberAvailabilityRepository,
		private readonly appointmentRepository: IAppointmentRepository,
	) {}

	async execute({
		barberId,
		date,
		serviceDurationMin = 30,
	}: GetBarberAvailableTimesUseCaseRequest): Promise<GetBarberAvailableTimesUseCaseResponse> {
		const weekday = date.getDay();

		const availabilitySlots =
			await this.barberAvailabilityRepository.findByBarberIdAndWeekday(
				barberId,
				weekday,
			);

		if (availabilitySlots.length === 0) {
			return {
				data: {
					timeSlots: [],
					date: date.toISOString().split("T")[0],
					barberId,
				},
			};
		}

		const appointments = await this.appointmentRepository.findByBarberIdAndDate(
			barberId,
			date,
		);

		const SLOT_DURATION = 30;
		const timeSlots: TimeSlot[] = [];

		for (const slot of availabilitySlots) {
			const start = timeToMinutes(slot.startTime);
			const end = timeToMinutes(slot.endTime);

			// Gera slots de 30 em 30 minutos dentro desse período
			for (
				let time = start;
				time + serviceDurationMin <= end;
				time += SLOT_DURATION
			) {
				const occupied = isSlotOccupied(time, appointments);

				timeSlots.push({
					time: minutesToTime(time),
					isAvailable: !occupied,
				});
			}
		}

		return {
			data: {
				timeSlots,
				date: date.toISOString().split("T")[0],
				barberId,
			},
		};
	}
}
