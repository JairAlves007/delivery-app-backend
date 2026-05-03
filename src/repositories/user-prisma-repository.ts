import type {
	PermissionType,
	Prisma,
	RoleType,
	User
} from "@/generated/prisma/client.js";
import {
	buildFilterQueryOptions,
	transformValidFilterParams
} from "@/helpers/crud.js";
import type { IUserRepository } from "@/interfaces/repositories/user-repository.js";
import prisma from "@/lib/prisma.js";
import type {
	DeleteContentParams,
	FilterParams,
	PaginationParams,
	UpdateContentParams
} from "@/types/crud.js";
import type { UserID, UserWithRole } from "@/types/user.js";

export class UserPrismaRepository implements IUserRepository {
	async findById(id: string): Promise<UserWithRole | null> {
		return await prisma.user.findUnique({
			where: { id, deleted_at: null },
			include: { role: true, establishment: true }
		});
	}

	async findByEmail(email: string): Promise<UserWithRole | null> {
		return await prisma.user.findUnique({
			where: { email, deleted_at: null },
			include: { role: true, establishment: true }
		});
	}

	async getPermissions(userId: UserID): Promise<PermissionType[]> {
		const userPermissions = await prisma.user.findUnique({
			where: { id: userId },
			include: {
				role: {
					select: {
						permissions: {
							select: {
								permission: { select: { name: true } }
							}
						}
					}
				}
			}
		});

		if (!userPermissions || !userPermissions.role) return [];

		return userPermissions.role.permissions.map(p => p.permission.name);
	}

	async create(data: Prisma.UserCreateInput): Promise<User> {
		return await prisma.user.create({ data });
	}

	async listAllByRole(
		role: RoleType,
		filterParams?: FilterParams
	): Promise<UserWithRole[]> {
		const { search, sortField, sortDirection } =
			transformValidFilterParams(filterParams);

		const { where, orderBy } =
			buildFilterQueryOptions<Prisma.UserOrderByWithRelationInput>({
				search,
				sortField: sortField ?? "created_at",
				sortDirection: sortDirection ?? "desc",
				searchableFields: ["name", "email"],
				defaultSortField: "created_at"
			});

		return await prisma.user.findMany({
			where: { deleted_at: null, role: { name: role }, ...where },
			include: { role: true, establishment: true },
			orderBy
		});
	}

	async countByRole(
		role: RoleType,
		filterParams?: FilterParams
	): Promise<number> {
		const { search } = transformValidFilterParams(filterParams);

		const { where } =
			buildFilterQueryOptions<Prisma.UserOrderByWithRelationInput>({
				search,
				sortField: undefined,
				sortDirection: undefined,
				searchableFields: ["name", "email"],
				defaultSortField: "created_at"
			});

		return await prisma.user.count({
			where: { deleted_at: null, role: { name: role }, ...where }
		});
	}

	async paginateByRole(
		role: RoleType,
		{ page, perPage, filterParams }: PaginationParams
	): Promise<UserWithRole[]> {
		const { search, sortField, sortDirection } =
			transformValidFilterParams(filterParams);

		const { where, orderBy } =
			buildFilterQueryOptions<Prisma.UserOrderByWithRelationInput>({
				search,
				sortField: sortField ?? "created_at",
				sortDirection: sortDirection ?? "desc",
				searchableFields: ["name", "email"],
				defaultSortField: "created_at"
			});

		return await prisma.user.findMany({
			skip: (page - 1) * perPage,
			take: perPage,
			where: { deleted_at: null, role: { name: role }, ...where },
			include: { role: true, establishment: true },
			orderBy
		});
	}

	async update({
		id,
		data
	}: UpdateContentParams<string, Prisma.UserUpdateInput>): Promise<User> {
		return await prisma.user.update({
			where: { id, deleted_at: null },
			data
		});
	}

	async delete({ id, force }: DeleteContentParams<string>): Promise<void> {
		if (force) {
			await prisma.user.delete({ where: { id } });
			return;
		}

		await prisma.user.update({
			where: { id, deleted_at: null },
			data: { deleted_at: new Date() }
		});
	}
}
