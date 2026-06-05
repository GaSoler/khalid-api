import type { DB } from "@/infrastructure/database/index";
import { ServiceRepository } from "@/infrastructure/database/service.repository.impl";
import { UpdateServiceUseCase } from "../update-service.use-case";

export function updateServiceFactory(db: DB) {
	const serviceRepository = new ServiceRepository(db);

	const updateServiceFactory = new UpdateServiceUseCase(serviceRepository);

	return updateServiceFactory;
}
