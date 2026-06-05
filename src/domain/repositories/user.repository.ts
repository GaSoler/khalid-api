import type {
	PaginatedResult,
	PaginationParams,
	UserRole,
} from "@/shared/types";
import type { UserEntity } from "../entities/user.entity";

export interface IUserRepository {
	findAll: (
		params: PaginationParams,
		filters?: {
			roles?: UserRole[];
			search?: string;
		},
	) => Promise<PaginatedResult<UserEntity>>;
	findById: (id: string) => Promise<UserEntity | null>;
	updateRoles: (id: string, roles: UserRole[]) => Promise<UserEntity>;
	delete(id: string): Promise<void>;
}
