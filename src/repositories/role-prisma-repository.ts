import type { RoleType } from "@/generated/prisma/client.js";
import type { IRoleRepository } from "@/interfaces/repositories/role-repository.js";
import prisma from "@/lib/prisma.js";
import type { RoleWithPermissions } from "@/types/role.js";

export class RolePrismaRepository implements IRoleRepository {
  async findByName(name: RoleType): Promise<RoleWithPermissions | null> {
    return await prisma.role.findUnique({
      where: {
        name,
      },
      include: {
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
    });
  }
}
