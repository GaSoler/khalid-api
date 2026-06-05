import type { FastifyReply, FastifyRequest } from "fastify";
import { getAvailabilityFactory } from "@/application/use-cases/barber/factories/get-availability.factory";

export async function getAvailability(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const barberId = request.user.id;

	const useCase = getAvailabilityFactory(request.server.db);

	const result = await useCase.execute({ barberId });

	return reply.send(result);
}
