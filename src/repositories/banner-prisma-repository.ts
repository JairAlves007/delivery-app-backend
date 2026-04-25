import type { Prisma } from "@/generated/prisma/client.js";
import {
  buildFilterQueryOptions,
  transformValidFilterParams,
} from "@/helpers/crud.js";
import type { IBannerRepository } from "@/interfaces/repositories/banner-repository.js";
import prisma from "@/lib/prisma.js";
import type { BannerFromRepository } from "@/types/banner.js";
import type {
  CursorPaginationParams,
  DeleteContentParams,
  FilterParams,
  FindByIdParams,
  PaginationParams,
  UpdateContentParams,
} from "@/types/crud.js";

export class BannerPrismaRepository implements IBannerRepository {
  async listAll(filterParams?: FilterParams): Promise<BannerFromRepository[]> {
    const { search, sortField, sortDirection, ...params } =
      transformValidFilterParams(filterParams);

    const { where, orderBy } =
      buildFilterQueryOptions<Prisma.BannerOrderByWithRelationInput>({
        search,
        sortField: sortField ?? "created_at",
        sortDirection: sortDirection ?? "desc",
        searchableFields: ["name"],
        defaultSortField: "created_at",
      });

    return await prisma.banner.findMany({
      where: {
        deleted_at: null,
        ...where,
        ...params,
      },
      include: {
        resources: {
          select: {
            resource: true,
          },
        },
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
      buildFilterQueryOptions<Prisma.BannerOrderByWithRelationInput>({
        search,
        sortField,
        sortDirection,
        searchableFields: ["name"],
        defaultSortField: "created_at",
      });

    return await prisma.banner.count({
      where: {
        deleted_at: null,
        ...where,
        ...params,
      },
    });
  }

  async paginate({
    perPage,
    page,
    filterParams,
  }: PaginationParams): Promise<BannerFromRepository[]> {
    const { search, sortField, sortDirection, ...params } =
      transformValidFilterParams(filterParams);

    const { where, orderBy } =
      buildFilterQueryOptions<Prisma.BannerOrderByWithRelationInput>({
        search,
        sortField: sortField ?? "created_at",
        sortDirection: sortDirection ?? "desc",
        searchableFields: ["name"],
        defaultSortField: "created_at",
      });

    return await prisma.banner.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
      where: {
        deleted_at: null,
        ...where,
        ...params,
      },
      include: {
        resources: {
          select: {
            resource: true,
          },
        },
      },
      orderBy,
    });
  }

  async cursorPaginate({
    limit,
    cursor,
    filterParams,
  }: CursorPaginationParams<number>): Promise<BannerFromRepository[]> {
    const { search, sortField, sortDirection, ...params } =
      transformValidFilterParams(filterParams);

    const { where, orderBy } =
      buildFilterQueryOptions<Prisma.BannerOrderByWithRelationInput>({
        search,
        sortField: sortField ?? "created_at",
        sortDirection: sortDirection ?? "desc",
        searchableFields: ["name"],
        defaultSortField: "created_at",
      });

    return await prisma.banner.findMany({
      where: {
        deleted_at: null,
        ...where,
        ...params,
      },
      include: {
        resources: {
          select: {
            resource: true,
          },
        },
      },
      orderBy,
      take: limit + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
    });
  }

  async findById({
    id,
    filterParams,
  }: FindByIdParams<number>): Promise<BannerFromRepository | null> {
    const params = transformValidFilterParams(filterParams);

    return await prisma.banner.findUnique({
      where: {
        id,
        deleted_at: null,
        ...params,
      },
      include: {
        resources: {
          select: {
            resource: true,
          },
        },
      },
    });
  }

  async create(data: Prisma.BannerCreateInput): Promise<void> {
    await prisma.banner.create({ data });
  }

  async update({
    id,
    data,
    filterParams,
  }: UpdateContentParams<number, Prisma.BannerUpdateInput>): Promise<void> {
    const params = transformValidFilterParams(filterParams);

    await prisma.banner.update({
      where: {
        id,
        deleted_at: null,
        ...params,
      },
      data,
    });
  }

  async delete({
    id,
    force,
    filterParams,
  }: DeleteContentParams<number>): Promise<void> {
    const params = transformValidFilterParams(filterParams);

    if (force) {
      await prisma.banner.delete({
        where: {
          id,
          ...params,
        },
      });
      return;
    }

    await this.update({
      id,
      filterParams,
      data: { deleted_at: new Date() },
    });
  }
}
