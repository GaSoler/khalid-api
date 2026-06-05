import type { DB } from "@/infrastructure/database/index";
import { UserRepository } from "@/infrastructure/database/user.repository.impl";
import { GetUserUseCase } from "../get-user.use-case";

export function getUserFactory(db: DB) {
	const userRepository = new UserRepository(db);

	const getUserFactory = new GetUserUseCase(userRepository);

	return getUserFactory;
}
