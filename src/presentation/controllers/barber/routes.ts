import type { FastifyInstance } from "fastify";
import { authMiddleware } from "@/presentation/middlewares/auth.middleware";
import { requireRoles } from "@/presentation/middlewares/require-roles.middleware";
import { cancelAppointment } from "./cancel-appointment.controller";
import { completeAppointment } from "./complete-appointment.controller";
import { createAppointment } from "./create-appointment.controller";
import { getAppointment } from "./get-appointment.controller";
import { getAvailability } from "./get-availability.controller";
import { getBarberAvailableTimes } from "./get-barber-available-times.controller";
import { getDashboard } from "./get-dashboard.controller";
import { listActiveCustomers } from "./list-active-customers.controller";
import { listActiveServices } from "./list-active-services.controller";
import { listAppointments } from "./list-appointments.controller";
import { setAvailability } from "./set-availability.controller";

export async function barberRoutes(app: FastifyInstance) {
	app.get(
		"/services",
		{ preHandler: [authMiddleware, requireRoles("barber")] },
		listActiveServices,
	);
	app.get(
		"/customers",
		{ preHandler: [authMiddleware, requireRoles("barber")] },
		listActiveCustomers,
	);
	app.get(
		"/available-times",
		{ preHandler: [authMiddleware, requireRoles("barber")] },
		getBarberAvailableTimes,
	);
	app.get(
		"/appointments",
		{ preHandler: [authMiddleware, requireRoles("barber")] },
		listAppointments,
	);
	app.get(
		"/appointments/:appointmentId",
		{ preHandler: [authMiddleware, requireRoles("barber")] },
		getAppointment,
	);
	app.post(
		"/appointments",
		{ preHandler: [authMiddleware, requireRoles("barber")] },
		createAppointment,
	);
	app.patch(
		"/appointments/:appointmentId/complete",
		{ preHandler: [authMiddleware, requireRoles("barber")] },
		completeAppointment,
	);
	app.patch(
		"/appointments/:appointmentId/cancel",
		{ preHandler: [authMiddleware, requireRoles("barber")] },
		cancelAppointment,
	);
	app.get(
		"/availability",
		{ preHandler: [authMiddleware, requireRoles("barber")] },
		getAvailability,
	);
	app.put(
		"/availability",
		{ preHandler: [authMiddleware, requireRoles("barber")] },
		setAvailability,
	);
	app.get(
		"/dashboard",
		{ preHandler: [authMiddleware, requireRoles("barber")] },
		getDashboard,
	);
}
