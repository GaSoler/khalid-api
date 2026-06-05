import type { UserEntity } from "@/domain/entities/user.entity";
import type { IUserRepository } from "@/domain/repositories/user.repository";
import type { PaginatedResult, PaginationParams } from "@/shared/types";

export class ListActiveBarbersUseCase {
	constructor(private readonly userRepository: IUserRepository) {}

	async execute(
		params: PaginationParams,
	): Promise<PaginatedResult<UserEntity>> {
		return this.userRepository.findAll(params, { roles: ["barber"] });
	}
}
