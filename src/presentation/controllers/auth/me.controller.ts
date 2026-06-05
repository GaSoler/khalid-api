import type { FastifyReply, FastifyRequest } from "fastify";

export async function me(request: FastifyRequest, reply: FastifyReply) {
	return reply.send({
		user: {
			id: request.user.id,
			email: request.user.email,
			full_name: request.user.full_name,
			avatar_url: request.user.avatar_url,
			roles: request.user.roles,
		},
	});
}
