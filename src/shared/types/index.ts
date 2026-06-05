export type UserRole = "customer" | "barber" | "admin";
export type AppointmentStatus = "scheduled" | "cancelled" | "completed";

declare module "fastify" {
	interface FastifyRequest {
		user: {
			id: string;
			email: string;
			full_name: string | null;
			avatar_url: string | null;
			roles: string[];
		};
	}
}

export interface PaginationParams {
	page?: number;
	limit?: number;
}

export interface PaginatedResult<T> {
	data: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}
