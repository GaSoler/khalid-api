import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { getAppointmentFactory } from "@/application/use-cases/customer/factories/get-appointment.factory";

export async function getAppointment(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const paramsSchema = z.object({
		appointmentId: z.string().uuid(),
	});

	const { appointmentId } = paramsSchema.parse(request.params);
	const customerId = request.user.id;

	const useCase = getAppointmentFactory(request.server.db);

	const result = await useCase.execute({ appointmentId, customerId });

	return reply.send(result);
}
