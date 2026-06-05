import type { FastifyReply, FastifyRequest } from "fastify";
import { ForbiddenError } from "@/shared/errors";

/**
 * Factory que retorna um middleware de autorização por roles.
 *
 * @example
 * // Apenas barber ou admin
 * { preHandler: [authMiddleware, requireRoles("barber")] }
 *
 * @example
 * // Apenas admin
 * { preHandler: [authMiddleware, requireRoles("admin")] }
 *
 * Admin SEMPRE passa em qualquer verificação de role.
 */
export function requireRoles(...allowedRoles: string[]) {
	return async (request: FastifyRequest, _reply: FastifyReply) => {
		if (!request.user) {
			throw new ForbiddenError("Authentication required");
		}

		// Admin sempre passa
		if (request.user.roles.includes("admin")) {
			return;
		}

		// Verifica se o user tem alguma das roles permitidas
		const hasRole = request.user.roles.some((role) =>
			allowedRoles.includes(role),
		);

		if (!hasRole) {
			throw new ForbiddenError(
				`Insufficient permissions. Required: ${allowedRoles.join(" or ")}`,
			);
		}
	};
}
