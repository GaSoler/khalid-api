import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { deleteUserFactory } from "@/application/use-cases/admin/factories/delete-user.factory";

export async function deleteUser(request: FastifyRequest, reply: FastifyReply) {
	const paramsSchema = z.object({
		userId: z.string().uuid(),
	});

	const { userId } = paramsSchema.parse(request.params);

	const useCase = deleteUserFactory(request.server.db);

	const result = await useCase.execute({ userId });

	return reply.status(200).send(result);
}
