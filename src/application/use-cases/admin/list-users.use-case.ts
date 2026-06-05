import type { UserEntity } from "@/domain/entities/user.entity";
import type { IUserRepository } from "@/domain/repositories/user.repository";
import type {
	PaginatedResult,
	PaginationParams,
	UserRole,
} from "@/shared/types";

interface ListUsersUseCaseRequest {
	params: PaginationParams;
	roles?: UserRole[];
	search?: string;
}

export class ListUsersUseCase {
	constructor(private readonly userRepository: IUserRepository) {}

	async execute({
		params,
		roles,
		search,
	}: ListUsersUseCaseRequest): Promise<PaginatedResult<UserEntity>> {
		const users = await this.userRepository.findAll(params, {
			roles,
			search,
		});

		return users;
	}
}
