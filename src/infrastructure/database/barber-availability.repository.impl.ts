import { eq } from "drizzle-orm";
import type { IBarberAvailabilityRepository } from "@/domain/repositories/barber-availability.repository";
import type { DB } from ".";
import { barberAvailability } from "./schema";

export class BarberAvailabilityRepository
	implements IBarberAvailabilityRepository
{
	constructor(private readonly db: DB) {}

	async findAllByBarberId(barberId: string) {
		return this.db
			.select()
			.from(barberAvailability)
			.where(eq(barberAvailability.barberId, barberId))
			.orderBy(barberAvailability.weekday);
	}

	async findByBarberIdAndWeekday(barberId: string, weekday: number) {
		return this.db
			.select()
			.from(barberAvailability)
			.where(
				eq(barberAvailability.barberId, barberId) &&
					eq(barberAvailability.weekday, weekday),
			)
			.orderBy(barberAvailability.startTime);
	}

	async replaceAll(
		barberId: string,
		slots: {
			weekday: number;
			startTime: string;
			endTime: string;
		}[],
	) {
		return this.db.transaction(async (tx) => {
			// Deleta tudo
			await tx
				.delete(barberAvailability)
				.where(eq(barberAvailability.barberId, barberId));

			// Insere novos
			if (slots.length > 0) {
				await tx.insert(barberAvailability).values(
					slots.map((slot) => ({
						...slot,
						barberId,
					})),
				);
			}

			// Retorna os novos
			return tx
				.select()
				.from(barberAvailability)
				.where(eq(barberAvailability.barberId, barberId))
				.orderBy(barberAvailability.weekday);
		});
	}
}
