import type {
  PermissionType,
  Prisma,
  User,
} from "@/generated/prisma/client.js";
import type { IUserRepository } from "@/interfaces/repositories/user-repository.js";
import prisma from "@/lib/prisma.js";
import type { UserWithRole } from "@/types/user.js";

export class UserPrismaRepository implements IUserRepository {
  async findById(id: string): Promise<UserWithRole | null> {
    const user = await prisma.user.findUnique({
      where: { id, deleted_at: null },
      include: { role: true, establishment: true },
    });

    return user;
  }

  async findByEmail(email: string): Promise<UserWithRole | null> {
    const user = await prisma.user.findUnique({
      where: { email, deleted_at: null },
      include: { role: true, establishment: true },
    });

    return user;
  }

  async getPermissions(userId: string): Promise<PermissionType[]> {
    const userPermissions = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        role: {
          select: {
            permissions: {
              select: {
                permission: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!userPermissions || !userPermissions.role) return [];

    return userPermissions.role.permissions.map((p) => p.permission.name);
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return await prisma.user.create({ data });
  }
}
