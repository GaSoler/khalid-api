import type { UserRole } from "@/shared/types";

export interface UserEntity {
	id: string;
	email: string;
	fullName: string | null;
	avatarUrl: string | null;
	roles: UserRole[];
	createdAt: Date;
	updatedAt: Date;
}
