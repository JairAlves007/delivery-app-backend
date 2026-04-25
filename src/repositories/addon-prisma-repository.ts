import type { Prisma } from "@/generated/prisma/client.js";
import {
  buildFilterQueryOptions,
  transformValidFilterParams,
} from "@/helpers/crud.js";
import type { IAddonRepository } from "@/interfaces/repositories/addon-repository.js";
import prisma from "@/lib/prisma.js";
import type { AddonFromRepository } from "@/types/addon.js";
import type {
  DeleteContentParams,
  FilterParams,
  FindByIdParams,
  PaginationParams,
  UpdateContentParams,
} from "@/types/crud.js";

export class AddonPrismaRepository implements IAddonRepository {
  async listAll(filterParams?: FilterParams): Promise<AddonFromRepository[]> {
    const { search, sortField, sortDirection, ...params } =
      transformValidFilterParams(filterParams);

    const { where, orderBy } =
      buildFilterQueryOptions<Prisma.AddonOrderByWithRelationInput>({
        search,
        sortField: sortField ?? "name",
        sortDirection: sortDirection ?? "asc",
        searchableFields: ["name"],
        defaultSortField: "name",
      });

    return await prisma.addon.findMany({
      where: {
        deleted_at: null,
        ...where,
        category: {
          deleted_at: null,
          ...params,
        },
      },
      include: {
        category: true,
      },
      orderBy,
    });
  }

  async count(filterParams?: FilterParams): Promise<number> {
    const {
      search,
      sortField = undefined,
      sortDirection = undefined,
      ...params
    } = transformValidFilterParams(filterParams);

    const { where } =
      buildFilterQueryOptions<Prisma.AddonOrderByWithRelationInput>({
        search,
        sortField,
        sortDirection,
        searchableFields: ["name"],
        defaultSortField: "name",
      });

    return await prisma.addon.count({
      where: {
        deleted_at: null,
        ...where,
        category: {
          deleted_at: null,
          ...params,
        },
      },
    });
  }

  async paginate({
    page,
    perPage,
    filterParams,
  }: PaginationParams): Promise<AddonFromRepository[]> {
    const { search, sortField, sortDirection, ...params } =
      transformValidFilterParams(filterParams);

    const { where, orderBy } =
      buildFilterQueryOptions<Prisma.AddonOrderByWithRelationInput>({
        search,
        sortField: sortField ?? "name",
        sortDirection: sortDirection ?? "asc",
        searchableFields: ["name"],
        defaultSortField: "name",
      });

    return await prisma.addon.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
      where: {
        deleted_at: null,
        ...where,
        category: {
          deleted_at: null,
          ...params,
        },
      },
      include: {
        category: true,
      },
      orderBy,
    });
  }

  async findById({
    id,
    filterParams,
  }: FindByIdParams<number>): Promise<AddonFromRepository | null> {
    const params = transformValidFilterParams(filterParams);

    return await prisma.addon.findUnique({
      where: {
        id,
        deleted_at: null,
        category: {
          deleted_at: null,
          ...params,
        },
      },
      include: {
        category: true,
      },
    });
  }

  async create(data: Prisma.AddonCreateInput): Promise<void> {
    await prisma.addon.create({ data });
  }

  async update({
    id,
    data,
  }: UpdateContentParams<number, Prisma.AddonUpdateInput>): Promise<void> {
    await prisma.addon.update({
      where: {
        id,
        deleted_at: null,
      },
      data,
    });
  }

  async delete({
    id,
    force,
    filterParams,
  }: DeleteContentParams<number>): Promise<void> {
    if (force) {
      await prisma.addon.delete({
        where: {
          id,
        },
      });
    }

    await this.update({
      id,
      filterParams,
      data: { deleted_at: new Date() },
    });
  }
}
