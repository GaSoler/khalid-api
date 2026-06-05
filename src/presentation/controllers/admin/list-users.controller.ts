import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { listUsersFactory } from "@/application/use-cases/admin/factories/list-users.factory";

export async function listUsers(request: FastifyRequest, reply: FastifyReply) {
	const querySchema = z.object({
		page: z.coerce.number().default(1),
		limit: z.coerce.number().default(10),
		roles: z.array(z.enum(["customer", "barber", "admin"])).optional(),
		search: z.string().optional(),
	});

	const { page, limit, roles, search } = querySchema.parse(request.query);

	const useCase = listUsersFactory(request.server.db);

	const result = await useCase.execute({
		params: { page, limit },
		roles,
		search,
	});

	return reply.send(result);
}
