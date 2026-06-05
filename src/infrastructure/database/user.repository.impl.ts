import { and, count, eq, ilike, or, sql } from "drizzle-orm";
import type { IUserRepository } from "@/domain/repositories/user.repository";
import type { PaginationParams, UserRole } from "@/shared/types";
import { paginate, paginationOffset } from "@/shared/utils";
import type { DB } from "./index";
import { users } from "./schema";

export class UserRepository implements IUserRepository {
	constructor(private readonly db: DB) {}

	async findAll(
		params: PaginationParams,
		filters?: { roles?: UserRole[]; search?: string },
	) {
		const { limit, offset } = paginationOffset(params);

		const conditions = [];

		if (filters?.roles?.length) {
			conditions.push(
				sql`${users.roles} && ARRAY[${sql.join(
					filters.roles.map((role) => sql`${role}`),
					sql`, `,
				)}]::user_role[]`,
			);
		}

		if (filters?.search) {
			conditions.push(
				or(
					ilike(users.fullName, `%${filters.search}%`),
					ilike(users.email, `%${filters.search}%`),
				),
			);
		}

		const where = conditions.length > 0 ? and(...conditions) : undefined;

		const [{ value: total }] = await this.db
			.select({ value: count() })
			.from(users)
			.where(where);

		const data = await this.db
			.select()
			.from(users)
			.where(where)
			.orderBy(users.fullName)
			.limit(limit)
			.offset(offset);

		return paginate(data, total, params);
	}

	async findById(id: string) {
		const [user] = await this.db
			.select()
			.from(users)
			.where(eq(users.id, id))
			.limit(1);

		return user ?? null;
	}

	async updateRoles(id: string, roles: UserRole[]) {
		const [updated] = await this.db
			.update(users)
			.set({ roles })
			.where(eq(users.id, id))
			.returning();

		return updated;
	}

	async delete(id: string) {
		await this.db.delete(users).where(eq(users.id, id));
	}
}
