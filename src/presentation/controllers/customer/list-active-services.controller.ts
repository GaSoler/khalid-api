import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { listActiveServicesFactory } from "@/application/use-cases/customer/factories/list-active-services.factory";

export async function listActiveServices(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const paramsSchema = z.object({
		page: z.coerce.number().int().positive().default(1),
		limit: z.coerce.number().int().min(1).max(100).default(20),
	});

	const { page, limit } = paramsSchema.parse(request.query);

	const useCase = listActiveServicesFactory(request.server.db);

	const result = await useCase.execute({ page, limit });

	return reply.send(result);
}
