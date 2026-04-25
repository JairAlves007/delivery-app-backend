import type {
  PermissionType,
  Prisma,
  RoleType,
  User,
} from "@/generated/prisma/client.js";
import type {
  DeleteContentParams,
  FilterParams,
  PaginationParams,
  UpdateContentParams,
} from "@/types/crud.js";
import type { UserWithRole } from "@/types/user.js";

export interface IUserRepository {
  findById(id: string): Promise<UserWithRole | null>;

  findByEmail(email: string): Promise<UserWithRole | null>;

  create(data: Prisma.UserCreateInput): Promise<User>;

  getPermissions(userId: string): Promise<PermissionType[]>;

  listAllByRole(
    role: RoleType,
    filterParams?: FilterParams,
  ): Promise<UserWithRole[]>;

  countByRole(role: RoleType, filterParams?: FilterParams): Promise<number>;

  paginateByRole(
    role: RoleType,
    params: PaginationParams,
  ): Promise<UserWithRole[]>;

  update(
    params: UpdateContentParams<string, Prisma.UserUpdateInput>,
  ): Promise<User>;

  delete(params: DeleteContentParams<string>): Promise<void>;
}
