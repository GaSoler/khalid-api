// src/presentation/controllers/barber/set-barber-availability.controller.ts
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { setAvailabilityFactory } from "@/application/use-cases/barber/factories/set-availability.factory";

export async function setAvailability(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const bodySchema = z.array(
		z.object({
			weekday: z.number().int().min(0).max(6),
			startTime: z.string().regex(/^\d{2}:\d{2}$/),
			endTime: z.string().regex(/^\d{2}:\d{2}$/),
		}),
	);

	const availabilities = bodySchema.parse(request.body);
	const barberId = request.user.id;

	const useCase = setAvailabilityFactory(request.server.db);

	const result = await useCase.execute({ barberId, availabilities });

	return reply.status(200).send(result);
}
