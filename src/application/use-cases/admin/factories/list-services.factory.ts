import type { DB } from "@/infrastructure/database/index";
import { ServiceRepository } from "@/infrastructure/database/service.repository.impl";
import { ListServicesUseCase } from "../list-services.use-case";

export function listServicesFactory(db: DB) {
	const serviceRepository = new ServiceRepository(db);

	const listServicesFactory = new ListServicesUseCase(serviceRepository);

	return listServicesFactory;
}
