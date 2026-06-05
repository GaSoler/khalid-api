import type { IUserRepository } from "@/domain/repositories/user.repository";
import { NotFoundError } from "@/shared/errors";

interface DeleteUserUseCaseRequest {
	userId: string;
}

interface DeleteUserUseCaseResponse {
	message: string;
}

export class DeleteUserUseCase {
	constructor(private readonly userRepository: IUserRepository) {}

	async execute({
		userId,
	}: DeleteUserUseCaseRequest): Promise<DeleteUserUseCaseResponse> {
		const user = await this.userRepository.findById(userId);

		if (!user) {
			throw new NotFoundError("User");
		}

		await this.userRepository.delete(userId);

		return { message: "User deleted successfully" };
	}
}
