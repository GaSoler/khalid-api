import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { changeUserRoleFactory } from "@/application/use-cases/admin/factories/change-user-role.factory";

export async function changeUserRole(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const paramsSchema = z.object({
		userId: z.string().uuid(),
	});

	const bodySchema = z.object({
		role: z.enum(["customer", "barber", "admin"]),
	});

	const { userId } = paramsSchema.parse(request.params);
	const { role } = bodySchema.parse(request.body);

	const useCase = changeUserRoleFactory(request.server.db);

	const result = await useCase.execute({ userId, newRole: role });

	return reply.send(result);
}
