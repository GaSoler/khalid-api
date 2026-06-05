export interface BarberAvailabilityEntity {
	id: string;
	barberId: string;
	weekday: number;
	startTime: string;
	endTime: string;
	createdAt: Date;
}
