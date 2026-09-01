import type { ServiceEntity } from "@/domain/entities/service.entity";

export interface ServiceDTO {
	id: string;
	name: string;
	description: string | null;
	durationMin: number;
	priceCents: number;
	active: boolean;
}

export function toServiceDTO(entity: ServiceEntity): ServiceDTO {
	return {
		id: entity.id,
		name: entity.name,
		description: entity.description,
		durationMin: entity.durationMin,
		priceCents: entity.priceCents,
		active: entity.active,
	};
}
