import type { DB } from "@/infrastructure/database";
import { UserRepository } from "@/infrastructure/database/user.repository.impl";
import { ListActiveBarbersUseCase } from "../list-active-barbers.use-case";

export function listActiveBarbersFactory(db: DB) {
	const userRepository = new UserRepository(db);

	const listActiveBarbersFactory = new ListActiveBarbersUseCase(userRepository);

	return listActiveBarbersFactory;
}
