import type { FastifyInstance } from "fastify";
import { authMiddleware } from "@/presentation/middlewares/auth.middleware";
import { me } from "./me.controller";

export async function authRoutes(app: FastifyInstance) {
	app.get("/me", { preHandler: [authMiddleware] }, me);
}
