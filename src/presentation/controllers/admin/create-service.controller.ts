import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { createServiceFactory } from "@/application/use-cases/admin/factories/create-service.factory";

export async function createService(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const bodySchema = z.object({
		name: z.string().min(3).max(100),
		description: z.string().optional(),
		priceBRL: z.number().positive(),
		durationMin: z.number().int().min(15).max(240),
	});

	const { name, description, priceBRL, durationMin } = bodySchema.parse(
		request.body,
	);

	const useCase = createServiceFactory(request.server.db);

	const result = await useCase.execute({
		name,
		description,
		priceBRL,
		durationMin,
	});

	return reply.status(201).send(result);
}
