import type { DB } from "@/infrastructure/database/index";
import { ServiceRepository } from "@/infrastructure/database/service.repository.impl";
import { DeleteServiceUseCase } from "../delete-service.use-case";

export function deleteServiceFactory(db: DB) {
	const serviceRepository = new ServiceRepository(db);

	const deleteServiceFactory = new DeleteServiceUseCase(serviceRepository);

	return deleteServiceFactory;
}
