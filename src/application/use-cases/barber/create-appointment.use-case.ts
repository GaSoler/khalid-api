import type { IAppointmentRepository } from "@/domain/repositories/appointment.repository";
import type { IBarberAvailabilityRepository } from "@/domain/repositories/barber-availability.repository";
import type { IServiceRepository } from "@/domain/repositories/service.repository";
import { ConflictError, NotFoundError } from "@/shared/errors";
import { isSlotOccupiedWithDuration, timeToMinutes } from "@/shared/utils";

interface CreateAppointmentUseCaseRequest {
	customerId: string;
	barberId: string;
	serviceId: string;
	date: Date;
	time: string; // "HH:MM"
}

interface CreateAppointmentUseCaseResponse {
	data: {
		id: string;
		customerId: string;
		barberId: string;
		serviceId: string;
		startsAt: Date;
		endsAt: Date;
		status: string;
	};
}

export class CreateAppointmentUseCase {
	constructor(
		private readonly appointmentRepository: IAppointmentRepository,
		private readonly serviceRepository: IServiceRepository,
		private readonly barberAvailabilityRepository: IBarberAvailabilityRepository,
	) {}

	async execute({
		customerId,
		barberId,
		serviceId,
		date,
		time,
	}: CreateAppointmentUseCaseRequest): Promise<CreateAppointmentUseCaseResponse> {
		// 1. Verifica se o serviço existe e está ativo
		const service = await this.serviceRepository.findById(serviceId);
		if (!service || !service.active) {
			throw new NotFoundError("Service");
		}

		// 2. Verifica disponibilidade do barbeiro no dia (múltiplos slots)
		const weekday = date.getDay();
		const availabilitySlots =
			await this.barberAvailabilityRepository.findByBarberIdAndWeekday(
				barberId,
				weekday,
			);

		if (availabilitySlots.length === 0) {
			throw new ConflictError("Barbeiro não atende neste dia");
		}

		// 3. Verifica se o horário está dentro de ALGUM slot disponível
		const [hours, minutes] = time.split(":").map(Number);
		const slotTime = hours * 60 + minutes;
		const slotDurationMinutes = service.durationMin;

		const fitsInAnySlot = availabilitySlots.some((slot) => {
			const startTime = timeToMinutes(slot.startTime);
			const endTime = timeToMinutes(slot.endTime);
			return slotTime >= startTime && slotTime + slotDurationMinutes <= endTime;
		});

		if (!fitsInAnySlot) {
			const times = availabilitySlots
				.map((s) => `${s.startTime}-${s.endTime}`)
				.join(" ou ");
			throw new ConflictError(`Barbeiro atende: ${times}`);
		}

		// 4. Verifica se o slot está ocupado
		const appointments = await this.appointmentRepository.findByBarberIdAndDate(
			barberId,
			date,
		);

		const occupied = isSlotOccupiedWithDuration(
			slotTime,
			slotDurationMinutes,
			appointments,
		);
		if (occupied) {
			throw new ConflictError("Horário indisponível");
		}

		// 5. Cria o agendamento
		const startsAt = new Date(date);
		startsAt.setHours(hours, minutes, 0, 0);
		const endsAt = new Date(startsAt);
		endsAt.setMinutes(endsAt.getMinutes() + slotDurationMinutes);

		const appointment = await this.appointmentRepository.create({
			customerId,
			barberId,
			serviceId,
			startsAt,
			endsAt,
			status: "scheduled",
			notes: null,
		});

		return {
			data: {
				id: appointment.id,
				customerId: appointment.customerId,
				barberId: appointment.barberId,
				serviceId: appointment.serviceId,
				startsAt: appointment.startsAt,
				endsAt: appointment.endsAt,
				status: appointment.status,
			},
		};
	}
}
