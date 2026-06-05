import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { deleteServiceFactory } from "@/application/use-cases/admin/factories/delete-service.factory";

export async function deleteService(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const paramsSchema = z.object({
		serviceId: z.string().uuid(),
	});

	const { serviceId } = paramsSchema.parse(request.params);

	const useCase = deleteServiceFactory(request.server.db);

	const result = await useCase.execute({ serviceId });

	return reply.status(200).send(result);
}
