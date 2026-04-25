import type { Prisma } from "@/generated/prisma/client.js";
import {
  buildFilterQueryOptions,
  transformValidFilterParams,
} from "@/helpers/crud.js";
import type { IAddonCategoryRepository } from "@/interfaces/repositories/addon-category-repository.js";
import prisma from "@/lib/prisma.js";
import type { AddonCategoryFromRepository } from "@/types/addon-category.js";
import type {
  DeleteContentParams,
  FilterParams,
  FindByIdParams,
  PaginationParams,
  UpdateContentParams,
} from "@/types/crud.js";

export class AddonCategoryPrismaRepository implements IAddonCategoryRepository {
  async listAll(
    filterParams?: FilterParams,
  ): Promise<AddonCategoryFromRepository[]> {
    const { search, sortField, sortDirection, ...params } =
      transformValidFilterParams(filterParams);

    const { where, orderBy } =
      buildFilterQueryOptions<Prisma.AddonCategoryOrderByWithRelationInput>({
        search,
        sortField: sortField ?? "name",
        sortDirection: sortDirection ?? "asc",
        searchableFields: ["name"],
        defaultSortField: "name",
      });

    return await prisma.addonCategory.findMany({
      where: {
        deleted_at: null,
        ...where,
        ...params,
      },
      include: {
        addons: true,
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
      buildFilterQueryOptions<Prisma.AddonCategoryOrderByWithRelationInput>({
        search,
        sortField,
        sortDirection,
        searchableFields: ["name"],
        defaultSortField: "name",
      });

    return await prisma.addonCategory.count({
      where: {
        deleted_at: null,
        ...where,
        ...params,
      },
    });
  }

  async paginate({
    page,
    perPage,
    filterParams,
  }: PaginationParams): Promise<AddonCategoryFromRepository[]> {
    const { search, sortField, sortDirection, ...params } =
      transformValidFilterParams(filterParams);

    const { where, orderBy } =
      buildFilterQueryOptions<Prisma.AddonCategoryOrderByWithRelationInput>({
        search,
        sortField: sortField ?? "name",
        sortDirection: sortDirection ?? "asc",
        searchableFields: ["name"],
        defaultSortField: "name",
      });

    return await prisma.addonCategory.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
      where: {
        deleted_at: null,
        ...where,
        ...params,
      },
      include: {
        addons: true,
      },
      orderBy,
    });
  }

  async findById({
    id,
    filterParams,
  }: FindByIdParams<number>): Promise<AddonCategoryFromRepository | null> {
    const params = transformValidFilterParams(filterParams);

    return await prisma.addonCategory.findUnique({
      where: {
        id,
        deleted_at: null,
        ...params,
      },
      include: {
        addons: true,
      },
    });
  }

  async create(data: Prisma.AddonCategoryCreateInput): Promise<void> {
    await prisma.addonCategory.create({ data });
  }

  async update({
    id,
    filterParams,
    data,
  }: UpdateContentParams<
    number,
    Prisma.AddonCategoryUpdateInput
  >): Promise<void> {
    const params = transformValidFilterParams(filterParams);

    await prisma.addonCategory.update({
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
      await prisma.addonCategory.delete({
        where: {
          id,
          ...params,
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
