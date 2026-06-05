import type { DB } from "@/infrastructure/database/index";
import { ServiceRepository } from "@/infrastructure/database/service.repository.impl";
import { ListActiveServicesUseCase } from "../list-active-services.use-case";

export function listActiveServicesFactory(db: DB) {
	const serviceRepository = new ServiceRepository(db);

	const listActiveServicesFactory = new ListActiveServicesUseCase(
		serviceRepository,
	);

	return listActiveServicesFactory;
}
