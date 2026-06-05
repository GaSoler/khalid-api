import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { cancelAppointmentFactory } from "@/application/use-cases/customer/factories/cancel-appointment.factory";

export async function cancelAppointment(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const paramsSchema = z.object({
		appointmentId: z.string().uuid(),
	});

	const { appointmentId } = paramsSchema.parse(request.params);
	const customerId = request.user.id;

	const useCase = cancelAppointmentFactory(request.server.db);

	const result = await useCase.execute({ appointmentId, customerId });

	return reply.send(result);
}
