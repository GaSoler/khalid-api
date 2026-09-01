import { toUserDTO, type UserDTO } from "@/domain/dtos/user.dto copy";
import type { UserEntity } from "@/domain/entities/user.entity";
import type { IUserRepository } from "@/domain/repositories/user.repository";
import type { PaginatedResult, PaginationParams } from "@/shared/types";

export class ListActiveBarbersUseCase {
	constructor(private readonly userRepository: IUserRepository) {}

	async execute(params: PaginationParams): Promise<PaginatedResult<UserDTO>> {
		const barbers = await this.userRepository.findAll(params, {
			roles: ["barber"],
		});

		return {
			...barbers,
			data: barbers.data.map((barber: UserEntity) => toUserDTO(barber)),
		};
	}
}
