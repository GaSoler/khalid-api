import { and, count, eq, gte, ilike, lte, or } from "drizzle-orm";
import type { IServiceRepository } from "@/domain/repositories/service.repository";
import type { PaginationParams } from "@/shared/types";
import { paginate, paginationOffset } from "@/shared/utils";
import { services } from "../database/schema";
import type { DB } from "./index";

export class ServiceRepository implements IServiceRepository {
	constructor(private readonly db: DB) {}

	async findAll(
		params: PaginationParams,
		filters?: {
			active?: boolean;
			search?: string;
			priceRange?: { min: number; max: number };
			durationRange?: { min: number; max: number };
		},
	) {
		const { limit, offset } = paginationOffset(params);

		const conditions = [];

		if (filters?.active !== undefined) {
			conditions.push(eq(services.active, filters.active));
		}

		if (filters?.search) {
			conditions.push(
				or(
					ilike(services.name, `%${filters.search}%`),
					ilike(services.description, `%${filters.search}%`),
				),
			);
		}

		if (filters?.priceRange) {
			const minCents = Math.round(filters.priceRange.min * 100);
			const maxCents = Math.round(filters.priceRange.max * 100);
			conditions.push(
				and(
					gte(services.priceCents, minCents),
					lte(services.priceCents, maxCents),
				),
			);
		}

		if (filters?.durationRange) {
			conditions.push(
				and(
					gte(services.durationMin, filters.durationRange.min),
					lte(services.durationMin, filters.durationRange.max),
				),
			);
		}

		const where = conditions.length > 0 ? and(...conditions) : undefined;

		const [{ value: total }] = await this.db
			.select({ value: count() })
			.from(services)
			.where(where);

		const data = await this.db
			.select()
			.from(services)
			.where(where)
			.orderBy(services.name)
			.limit(limit)
			.offset(offset);

		return paginate(data, total, params);
	}

	async findById(id: string) {
		const [service] = await this.db
			.select()
			.from(services)
			.where(eq(services.id, id))
			.limit(1);

		return service ?? null;
	}

	async create(data: {
		name: string;
		description?: string;
		priceCents: number;
		durationMin: number;
	}) {
		const [service] = await this.db
			.insert(services)
			.values({
				name: data.name,
				description: data.description,
				priceCents: data.priceCents,
				durationMin: data.durationMin,
			})
			.returning();
		return service;
	}

	async update(
		id: string,
		data: Partial<{
			name: string;
			description: string | null;
			priceCents: number;
			durationMin: number;
			active: boolean;
		}>,
	) {
		const [updated] = await this.db
			.update(services)
			.set(data)
			.where(eq(services.id, id))
			.returning();

		return updated;
	}

	async delete(id: string) {
		await this.db.delete(services).where(eq(services.id, id));
	}
}
