import type { ServiceEntity } from "@/domain/entities/service.entity";
import type { PaginatedResult, PaginationParams } from "@/shared/types";

export interface IServiceRepository {
	findAll: (
		params: PaginationParams,
		filters?: {
			active?: boolean;
			search?: string;
			priceRange?: { min: number; max: number };
			durationRange?: { min: number; max: number };
		},
	) => Promise<PaginatedResult<ServiceEntity>>;
	findById: (id: string) => Promise<ServiceEntity | null>;
	create: (data: {
		name: string;
		description?: string;
		priceCents: number;
		durationMin: number;
	}) => Promise<ServiceEntity>;
	update(
		id: string,
		data: Partial<{
			name: string;
			description: string | null;
			priceCents: number;
			durationMin: number;
			active: boolean;
		}>,
	): Promise<ServiceEntity>;
	delete(id: string): Promise<void>;
}
