import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { createAppointmentFactory } from "@/application/use-cases/customer/factories/create-appointment.factory";

export async function createAppointment(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const bodySchema = z.object({
		barberId: z.string().uuid(),
		serviceId: z.string().uuid(),
		date: z.coerce.date(),
		time: z.string().regex(/^\d{2}:\d{2}$/),
	});

	const { barberId, serviceId, date, time } = bodySchema.parse(request.body);
	const customerId = request.user.id;

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
