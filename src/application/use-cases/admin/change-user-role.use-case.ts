import type { UserEntity } from "@/domain/entities/user.entity";
import type { IUserRepository } from "@/domain/repositories/user.repository";
import { ConflictError, NotFoundError } from "@/shared/errors";
import type { UserRole } from "@/shared/types";

interface ChangeUserRoleUseCaseRequest {
	userId: string;
	newRole: UserRole;
}

interface ChangeUserRoleUseCaseResponse {
	data: UserEntity;
}

export class ChangeUserRoleUseCase {
	constructor(private readonly userRepository: IUserRepository) {}

	async execute({
		userId,
		newRole,
	}: ChangeUserRoleUseCaseRequest): Promise<ChangeUserRoleUseCaseResponse> {
		const user = await this.userRepository.findById(userId);

		if (!user) {
			throw new NotFoundError("User");
		}

		// Validação: só permite transições válidas
		// customer → barber
		// barber → customer ou admin
		// admin → barber ou customer
		const validTransitions: Record<UserRole, UserRole[]> = {
			customer: ["barber"],
			barber: ["customer", "admin"],
			admin: ["barber", "customer"],
		};

		const currentRole = user.roles[0]; // Sempre só 1 role
		const allowedTransitions = validTransitions[currentRole];

		if (!allowedTransitions.includes(newRole)) {
			throw new ConflictError(
				`Cannot transition from ${currentRole} to ${newRole}`,
			);
		}

		// Se newRole é admin, precisa ter barber também
		const finalRoles: UserRole[] =
			newRole === "admin" ? ["barber", "admin"] : [newRole];

		const updated = await this.userRepository.updateRoles(userId, finalRoles);

		return { data: updated };
	}
}
