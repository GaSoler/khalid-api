import type { UserEntity } from "../entities/user.entity";

export interface UserDTO {
	id: string;
	email: string;
	fullName: string | null;
	avatarUrl: string | null;
	roles: string[];
}

export function toUserDTO(entity: UserEntity): UserDTO {
	return {
		id: entity.id,
		email: entity.email,
		fullName: entity.fullName,
		avatarUrl: entity.avatarUrl,
		roles: entity.roles,
	};
}
