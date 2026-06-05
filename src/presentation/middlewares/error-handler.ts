import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { AppError } from "../../shared/errors/index.js";
import { env } from "../../shared/utils/env.js";

export async function errorHandler(app: FastifyInstance) {
	app.setErrorHandler((error, _request, reply) => {
		// Zod validation errors
		if (error instanceof ZodError) {
			return reply.status(422).send({
				code: "VALIDATION_ERROR",
				message: "Invalid request data",
				errors: error.flatten().fieldErrors,
			});
		}

		// Known application errors
		if (error instanceof AppError) {
			return reply.status(error.statusCode).send({
				code: error.code,
				message: error.message,
			});
		}

		// Unknown errors — don't leak internals in production
		app.log.error(error);

		return reply.status(500).send({
			code: "INTERNAL_SERVER_ERROR",
			message:
				env.NODE_ENV === "production"
					? "Internal server error"
					: error instanceof Error
						? error.message
						: "Unknown error",
		});
	});
}
