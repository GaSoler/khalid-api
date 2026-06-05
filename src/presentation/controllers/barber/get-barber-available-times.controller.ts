import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { getBarberAvailableTimesFactory } from "@/application/use-cases/barber/factories/get-barber-available-times.factory";

export async function getBarberAvailableTimes(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const querySchema = z.object({
		date: z.coerce.date(),
	});

	const { date } = querySchema.parse(request.query);
	const barberId = request.user.id;

	const useCase = getBarberAvailableTimesFactory(request.server.db);

	const result = await useCase.execute({ barberId, date });

	return reply.send(result);
}
