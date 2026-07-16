import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { listAppointmentsFactory } from "@/application/use-cases/admin/factories/list-appointments.factory";

export async function listAppointments(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const querySchema = z.object({
		customerId: z.string().uuid().optional(),
		barberId: z.string().uuid().optional(),
		serviceId: z.string().uuid().optional(),
		status: z.enum(["scheduled", "completed", "cancelled"]).optional(),
		from: z.coerce.date().optional(),
		to: z.coerce.date().optional(),
	});

	const { customerId, barberId, serviceId, status, from, to } =
		querySchema.parse(request.query);
	const useCase = listAppointmentsFactory(request.server.db);

	const result = await useCase.execute({
		customerId,
		barberId,
		serviceId,
		status,
		from,
		to,
	});

	return reply.send(result);
}
