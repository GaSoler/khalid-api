// src/presentation/controllers/barber/get-barber-dashboard.controller.ts
import type { FastifyReply, FastifyRequest } from "fastify";
import { getDashboardFactory } from "@/application/use-cases/barber/factories/get-dashboard.factory";

export async function getDashboard(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const barberId = request.user.id;

	const useCase = getDashboardFactory(request.server.db);

	const result = await useCase.execute({ barberId });

	return reply.send(result);
}
