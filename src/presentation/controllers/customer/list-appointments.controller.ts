import type { FastifyReply, FastifyRequest } from "fastify";
import { listAppointmentsFactory } from "@/application/use-cases/customer/factories/list-appointments.factory";

export async function listAppointments(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const customerId = request.user.id;

	const useCase = listAppointmentsFactory(request.server.db);

	const result = await useCase.execute({ customerId });

	return reply.send(result);
}
