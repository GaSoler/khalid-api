import type { FastifyReply, FastifyRequest } from "fastify";
import { getNextAppointmentFactory } from "@/application/use-cases/customer/factories/get-next-appointment.factory";

export async function getNextAppointment(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const customerId = request.user.id;

	const useCase = getNextAppointmentFactory(request.server.db);

	const result = await useCase.execute({ customerId });

	return reply.send(result);
}
