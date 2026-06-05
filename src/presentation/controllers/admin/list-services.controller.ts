import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { listServicesFactory } from "@/application/use-cases/admin/factories/list-services.factory";

export async function listServices(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const paramsSchema = z.object({
		page: z.coerce.number().int().positive().default(1),
		limit: z.coerce.number().int().min(1).max(100).default(20),
	});

	const { page, limit } = paramsSchema.parse(request.query);

	const useCase = listServicesFactory(request.server.db);

	const result = await useCase.execute({ page, limit });

	return reply.send(result);
}
