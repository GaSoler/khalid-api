export interface TimeSlot {
	time: string;
	isAvailable: boolean;
}

export interface AvailableTimesDTO {
	timeSlots: TimeSlot[];
	date: string;
	barberId: string;
}
