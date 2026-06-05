import type { UserEntity } from "@/domain/entities/user.entity";
import type { IUserRepository } from "@/domain/repositories/user.repository";
import { NotFoundError } from "@/shared/errors";

interface GetUserUseCaseRequest {
	userId: string;
}

interface GetUserUseCaseResponse {
	data: UserEntity;
}

export class GetUserUseCase {
	constructor(private readonly userRepository: IUserRepository) {}

	async execute({
		userId,
	}: GetUserUseCaseRequest): Promise<GetUserUseCaseResponse> {
		const user = await this.userRepository.findById(userId);

		if (!user) {
			throw new NotFoundError("User");
		}

		return { data: user };
	}
}
