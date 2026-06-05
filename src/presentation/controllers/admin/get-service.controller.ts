import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { getServiceFactory } from "@/application/use-cases/admin/factories/get-service.factory";

export async function getService(request: FastifyRequest, reply: FastifyReply) {
	const paramsSchema = z.object({
		serviceId: z.string().uuid(),
	});

	const { serviceId } = paramsSchema.parse(request.params);

	const useCase = getServiceFactory(request.server.db);

	const result = await useCase.execute({ serviceId });

	return reply.send(result);
}
