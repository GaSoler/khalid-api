import type { DB } from "@/infrastructure/database/index";
import { ServiceRepository } from "@/infrastructure/database/service.repository.impl";
import { CreateServiceUseCase } from "../create-service.use-case";

export function createServiceFactory(db: DB) {
	const serviceRepository = new ServiceRepository(db);

	const createServiceFactory = new CreateServiceUseCase(serviceRepository);

	return createServiceFactory;
}
