import { PermissionType, Role } from "@prisma/client";

export interface RoleWithPermissions extends Role {
	permissions: Array<{
		permission: {
			name: PermissionType;
		};
	}>;
}
