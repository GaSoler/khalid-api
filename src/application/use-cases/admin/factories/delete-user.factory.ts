import type { DB } from "@/infrastructure/database/index";
import { UserRepository } from "@/infrastructure/database/user.repository.impl";
import { DeleteUserUseCase } from "../delete-user.use-case";

export function deleteUserFactory(db: DB) {
	const userRepository = new UserRepository(db);

	const deleteUserFactory = new DeleteUserUseCase(userRepository);

	return deleteUserFactory;
}
