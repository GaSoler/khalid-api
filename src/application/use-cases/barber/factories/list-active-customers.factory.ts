import type { DB } from "@/infrastructure/database";
import { UserRepository } from "@/infrastructure/database/user.repository.impl";
import { ListActiveCustomersUseCase } from "../list-active-customers.use-case";

export function listActiveCustomersFactory(db: DB) {
	const userRepository = new UserRepository(db);

	const listActiveCustomersFactory = new ListActiveCustomersUseCase(
		userRepository,
	);

	return listActiveCustomersFactory;
}
