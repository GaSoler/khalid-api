import type { IAppointmentRepository } from "@/domain/repositories/appointment.repository";
import type { IBarberAvailabilityRepository } from "@/domain/repositories/barber-availability.repository";
import type { IServiceRepository } from "@/domain/repositories/service.repository";
import { ConflictError, NotFoundError } from "@/shared/errors";
import { isSlotOccupiedWithDuration, timeToMinutes } from "@/shared/utils";

interface CreateAppointmentUseCaseRequest {
	customerId: string;
	barberId: string;
	serviceId: string;
	date: string;
	time: string;
}

interface CreateAppointmentUseCaseResponse {
	data: {
		id: string;
		customerId: string;
		barberId: string;
		serviceId: string;
		startsAt: string;
		endsAt: string;
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
		// Parse date e time
		const [hours, minutes] = time.split(":").map(Number);
		const appointmentDate = new Date(date);

		// 0.1 Valida se é no passado
		const appointmentDateTime = new Date(appointmentDate);
		appointmentDateTime.setHours(hours, minutes, 0, 0);

		const now = new Date();
		if (appointmentDateTime < now) {
			throw new ConflictError(
				"Não é possível agendar para data/hora no passado",
			);
		}

		// 0.2 Verifica se customer já tem agendamento "scheduled"
		const existingScheduled =
			await this.appointmentRepository.findByCustomerIdAndStatus(
				customerId,
				"scheduled",
			);

		if (existingScheduled.length > 0) {
			throw new ConflictError(
				"Você já tem um agendamento ativo. Cancele-o antes de criar um novo.",
			);
		}

		// 1. Verifica se o serviço existe e está ativo
		const service = await this.serviceRepository.findById(serviceId);
		if (!service || !service.active) {
			throw new NotFoundError("Serviço não encontrado");
		}

		// 2. Extrai weekday e slot time (em horário local)
		const weekday = appointmentDate.getDay();
		const slotTime = hours * 60 + minutes;

		const availabilitySlots =
			await this.barberAvailabilityRepository.findByBarberIdAndWeekday(
				barberId,
				weekday,
			);

		if (availabilitySlots.length === 0) {
			throw new ConflictError("Barbeiro não atende neste dia");
		}

		// 3. Verifica se o horário cabe em algum slot
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
		// Usa a data original pra buscar agendamentos do dia
		const appointments = await this.appointmentRepository.findByBarberIdAndDate(
			barberId,
			appointmentDate,
		);

		const occupied = isSlotOccupiedWithDuration(
			slotTime,
			slotDurationMinutes,
			appointments,
		);

		if (occupied) {
			throw new ConflictError("Horário indisponível");
		}

		// 5. Converte pra UTC pra salvar (+3h pra SP→UTC)
		const startsAtUTC = new Date(appointmentDate);
		startsAtUTC.setUTCHours(hours + 3, minutes, 0, 0);

		const endsAtUTC = new Date(startsAtUTC);
		endsAtUTC.setUTCMinutes(endsAtUTC.getUTCMinutes() + slotDurationMinutes);

		const appointment = await this.appointmentRepository.create({
			customerId,
			barberId,
			serviceId,
			startsAt: startsAtUTC,
			endsAt: endsAtUTC,
			status: "scheduled",
			notes: null,
		});

		return {
			data: {
				id: appointment.id,
				customerId: appointment.customerId,
				barberId: appointment.barberId,
				serviceId: appointment.serviceId,
				startsAt: appointment.startsAt.toISOString(),
				endsAt: appointment.endsAt.toISOString(),
				status: appointment.status,
			},
		};
	}
}
