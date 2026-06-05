import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { listAppointmentsFactory } from "@/application/use-cases/barber/factories/list-appointments.factory";

export async function listAppointments(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const querySchema = z.object({
		status: z.enum(["scheduled", "completed", "cancelled"]).optional(),
		from: z.coerce.date().optional(),
		to: z.coerce.date().optional(),
	});

	const { status, from, to } = querySchema.parse(request.query);
	const barberId = request.user.id;

	const useCase = listAppointmentsFactory(request.server.db);

	const result = await useCase.execute({ barberId, status, from, to });

	return reply.send(result);
}
