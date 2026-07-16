import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import Fastify from "fastify";
import { db } from "./infrastructure/database";
import { adminRoutes } from "./presentation/controllers/admin/routes";
import { authRoutes } from "./presentation/controllers/auth/routes";
import { barberRoutes } from "./presentation/controllers/barber/routes";
import { customerRoutes } from "./presentation/controllers/customer/routes";
import { errorHandler } from "./presentation/middlewares/error-handler";
import { env } from "./shared/utils/env";

declare module "fastify" {
	interface FastifyInstance {
		db: typeof db;
	}
}

export async function buildApp() {
	const app = Fastify({
		logger: {
			level: env.NODE_ENV === "production" ? "warn" : "info",
			...(env.NODE_ENV === "development" && {
				transport: { target: "pino-pretty", options: { colorize: true } },
			}),
		},
	});

	app.decorate("db", db);

	await app.register(cookie);

	// ── Security plugins ──────────────────────────────────────
	await app.register(helmet);
	await app.register(cors, {
		origin: env.NODE_ENV === "production" ? ["https://seu-frontend.com"] : true,
	});

	// ── Global error handler ──────────────────────────────────
	await app.register(errorHandler);

	// ── Health check (used by Docker) ─────────────────────────
	app.get("/health", async (_request, reply) => {
		return reply
			.status(200)
			.send({ status: "ok", timestamp: new Date().toISOString() });
	});

	// ── Routes ────────────────────────────────────────────────
	await app.register(authRoutes, { prefix: "/api/v1/auth" });
	await app.register(customerRoutes, { prefix: "/api/v1/customer" });
	await app.register(barberRoutes, { prefix: "/api/v1/barber" });
	await app.register(adminRoutes, { prefix: "/api/v1/admin" });

	return app;
}
