import type { DB } from "@/infrastructure/database/index";
import { UserRepository } from "@/infrastructure/database/user.repository.impl";
import { ListUsersUseCase } from "../list-users.use-case";

export function listUsersFactory(db: DB) {
	const userRepository = new UserRepository(db);

	const listUsersFactory = new ListUsersUseCase(userRepository);

	return listUsersFactory;
}
