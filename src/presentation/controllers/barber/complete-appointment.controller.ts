import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { completeAppointmentFactory } from "@/application/use-cases/barber/factories/complete-appointment.factory";

export async function completeAppointment(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const paramsSchema = z.object({
		appointmentId: z.string().uuid(),
	});

	const { appointmentId } = paramsSchema.parse(request.params);
	const barberId = request.user.id;

	const useCase = completeAppointmentFactory(request.server.db);

	const result = await useCase.execute({ appointmentId, barberId });

	return reply.send(result);
}
