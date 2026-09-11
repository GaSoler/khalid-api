import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { createAppointmentFactory } from "@/application/use-cases/barber/factories/create-appointment.factory";

export async function createAppointment(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const bodySchema = z.object({
		customerId: z.string().uuid(),
		serviceId: z.string().uuid(),
		date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // "2026-09-15"
		time: z.string().regex(/^\d{2}:\d{2}$/), // "12:30"
	});

	const { customerId, serviceId, date, time } = bodySchema.parse(request.body);
	const barberId = request.user.id;

	const useCase = createAppointmentFactory(request.server.db);

	const result = await useCase.execute({
		customerId,
		barberId,
		serviceId,
		date,
		time,
	});

	return reply.status(201).send(result);
}
