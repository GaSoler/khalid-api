import type { FastifyInstance } from "fastify";
import { authMiddleware } from "@/presentation/middlewares/auth.middleware";
import { requireRoles } from "@/presentation/middlewares/require-roles.middleware";
import { cancelAppointment } from "./cancel-appointment.controller";
import { changeUserRole } from "./change-user-role.controller";
import { createService } from "./create-service.controller";
import { deleteService } from "./delete-service.controller";
import { deleteUser } from "./delete-user.controller";
import { getAppointment } from "./get-appointment.controller";
import { getService } from "./get-service.controller";
import { getUser } from "./get-user.controller";
import { listAppointments } from "./list-appointments.controller";
import { listServices } from "./list-services.controller";
import { listUsers } from "./list-users.controller";
import { updateService } from "./update-service.controller";

export async function adminRoutes(app: FastifyInstance) {
	app.get(
		"/users",
		{ preHandler: [authMiddleware, requireRoles("admin")] },
		listUsers,
	);
	app.get(
		"/users/:userId",
		{ preHandler: [authMiddleware, requireRoles("admin")] },
		getUser,
	);
	app.patch(
		"/users/:userId",
		{ preHandler: [authMiddleware, requireRoles("admin")] },
		changeUserRole,
	);
	app.delete(
		"/users/:userId",
		{ preHandler: [authMiddleware, requireRoles("admin")] },
		deleteUser,
	);
	app.get(
		"/services",
		{ preHandler: [authMiddleware, requireRoles("admin")] },
		listServices,
	);
	app.get(
		"/services/:serviceId",
		{ preHandler: [authMiddleware, requireRoles("admin")] },
		getService,
	);
	app.post(
		"/services",
		{ preHandler: [authMiddleware, requireRoles("admin")] },
		createService,
	);
	app.put(
		"/services/:serviceId",
		{ preHandler: [authMiddleware, requireRoles("admin")] },
		updateService,
	);
	app.delete(
		"/services/:serviceId",
		{ preHandler: [authMiddleware, requireRoles("admin")] },
		deleteService,
	);
	app.get(
		"/appointments",
		{ preHandler: [authMiddleware, requireRoles("admin")] },
		listAppointments,
	);
	app.get(
		"/appointments/:appointmentId",
		{ preHandler: [authMiddleware, requireRoles("admin")] },
		getAppointment,
	);
	app.patch(
		"/appointments/:appointmentId/cancel",
		{ preHandler: [authMiddleware, requireRoles("barber")] },
		cancelAppointment,
	);
}
