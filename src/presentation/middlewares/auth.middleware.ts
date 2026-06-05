import { eq } from "drizzle-orm";
import type { FastifyReply, FastifyRequest } from "fastify";
import { users } from "@/infrastructure/database/schema";
import { supabaseAdmin } from "@/infrastructure/external-apis/supabase";
import { UnauthorizedError } from "@/shared/errors";

export async function authMiddleware(
	request: FastifyRequest,
	_reply: FastifyReply,
) {
	const authHeader = request.headers.authorization;

	if (!authHeader?.startsWith("Bearer ")) {
		throw new UnauthorizedError("Invalid or expired token");
	}

	const token = authHeader.slice(7);

	try {
		const { data, error } = await supabaseAdmin.auth.getUser(token);

		if (error || !data.user) {
			throw new UnauthorizedError("Invalid or expired token");
		}

		const [user] = await request.server.db
			.select()
			.from(users)
			.where(eq(users.id, data.user.id));

		if (!user) {
			throw new UnauthorizedError("User not found");
		}

		request.user = {
			id: user.id,
			email: user.email,
			full_name: user.fullName,
			avatar_url: user.avatarUrl,
			roles: user.roles,
		};
	} catch (error) {
		if (error instanceof UnauthorizedError) {
			throw error;
		}
		throw new UnauthorizedError("Invalid token");
	}
}
