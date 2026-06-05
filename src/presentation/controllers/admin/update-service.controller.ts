import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { updateServiceFactory } from "@/application/use-cases/admin/factories/update-service.factory";

export async function updateService(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const paramsSchema = z.object({
		serviceId: z.string().uuid(),
	});

	const bodySchema = z.object({
		name: z.string().min(3).optional(),
		description: z.string().optional(),
		priceBRL: z.number().positive().optional(),
		durationMinutes: z.number().int().min(15).max(240).optional(),
		active: z.boolean().optional(),
	});

	const { serviceId } = paramsSchema.parse(request.params);
	const body = bodySchema.parse(request.body);

	const useCase = updateServiceFactory(request.server.db);

	const result = await useCase.execute({ serviceId, ...body });

	return reply.send(result);
}
