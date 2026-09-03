import { toUserDTO, type UserDTO } from "@/domain/dtos/user.dto";
import type { UserEntity } from "@/domain/entities/user.entity";
import type { IUserRepository } from "@/domain/repositories/user.repository";
import type { PaginatedResult, PaginationParams } from "@/shared/types";

export class ListActiveCustomersUseCase {
	constructor(private readonly userRepository: IUserRepository) {}

	async execute(params: PaginationParams): Promise<PaginatedResult<UserDTO>> {
		const customers = await this.userRepository.findAll(params, {
			roles: ["customer"],
		});

		return {
			...customers,
			data: customers.data.map((customer: UserEntity) => toUserDTO(customer)),
		};
	}
}
