import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { getBarberAvailableTimesFactory } from "@/application/use-cases/customer/factories/get-barber-available-times.factory";

export async function getBarberAvailableTimes(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const paramsSchema = z.object({
		barberId: z.string().uuid(),
	});

	const querySchema = z.object({
		date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // "2026-09-15"
	});

	const { barberId } = paramsSchema.parse(request.params);
	const { date } = querySchema.parse(request.query);

	const useCase = getBarberAvailableTimesFactory(request.server.db);

	const result = await useCase.execute({ barberId, date });

	return reply.send(result);
}
