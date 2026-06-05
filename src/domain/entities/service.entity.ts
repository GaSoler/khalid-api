export interface ServiceEntity {
	id: string;
	name: string;
	description: string | null;
	durationMin: number;
	priceCents: number;
	active: boolean;
	createdAt: Date;
	updatedAt: Date;
}
