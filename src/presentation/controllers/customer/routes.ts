import type { FastifyInstance } from "fastify";
import { authMiddleware } from "@/presentation/middlewares/auth.middleware";
import { cancelAppointment } from "./cancel-appointment.controller";
import { createAppointment } from "./create-appointment.controller";
import { getAppointment } from "./get-appointment.controller";
import { getBarberAvailableTimes } from "./get-barber-available-times.controller";
import { getNextAppointment } from "./get-next-appointment.controller";
import { listActiveBarbers } from "./list-active-barbers.controller";
import { listActiveServices } from "./list-active-services.controller";
import { listAppointments } from "./list-appointments.controller";

export async function customerRoutes(app: FastifyInstance) {
	app.get("/services", { preHandler: [authMiddleware] }, listActiveServices);
	app.get("/barbers", { preHandler: [authMiddleware] }, listActiveBarbers);
	app.get(
		"/barbers/:barberId/available-times",
		{ preHandler: [authMiddleware] },
		getBarberAvailableTimes,
	);
	app.get("/appointments", { preHandler: [authMiddleware] }, listAppointments);
	app.get(
		"/appointments/:appointmentId",
		{ preHandler: [authMiddleware] },
		getAppointment,
	);
	app.get(
		"/appointments/next",
		{ preHandler: [authMiddleware] },
		getNextAppointment,
	);
	app.post(
		"/appointments",
		{ preHandler: [authMiddleware] },
		createAppointment,
	);
	app.post(
		"/appointments/:appointmentId",
		{ preHandler: [authMiddleware] },
		cancelAppointment,
	);
}
