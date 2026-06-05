import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { listActiveCustomersFactory } from "@/application/use-cases/barber/factories/list-active-customers.factory";

export async function listActiveCustomers(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const paramsSchema = z.object({
		page: z.coerce.number().int().positive().default(1),
		limit: z.coerce.number().int().min(1).max(100).default(20),
	});

	const { page, limit } = paramsSchema.parse(request.query);

	const useCase = listActiveCustomersFactory(request.server.db);

	const result = await useCase.execute({
		page,
		limit,
	});

	return reply.send(result);
}
