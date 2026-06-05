import type { DB } from "@/infrastructure/database/index";
import { UserRepository } from "@/infrastructure/database/user.repository.impl";
import { ChangeUserRoleUseCase } from "../change-user-role.use-case";

export function changeUserRoleFactory(db: DB) {
	const userRepository = new UserRepository(db);

	const changeUserRoleFactory = new ChangeUserRoleUseCase(userRepository);

	return changeUserRoleFactory;
}
