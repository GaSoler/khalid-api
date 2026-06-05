import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { getUserFactory } from "@/application/use-cases/admin/factories/get-user.factory";

export async function getUser(request: FastifyRequest, reply: FastifyReply) {
	const paramsSchema = z.object({
		userId: z.string().uuid(),
	});

	const { userId } = paramsSchema.parse(request.params);

	const useCase = getUserFactory(request.server.db);

	const result = await useCase.execute({ userId });

	return reply.send(result);
}
