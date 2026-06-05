import type { DB } from "@/infrastructure/database/index";
import { ServiceRepository } from "@/infrastructure/database/service.repository.impl";
import { GetServiceUseCase } from "../get-service.use-case";

export function getServiceFactory(db: DB) {
	const serviceRepository = new ServiceRepository(db);

	const getServiceFactory = new GetServiceUseCase(serviceRepository);

	return getServiceFactory;
}
