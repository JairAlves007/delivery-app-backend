import type z from "zod";

import { InvalidPage } from "@/errors/pagination/invalid-page.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import Constants from "@/helpers/constants.js";
import type { IEstablishmentRepository } from "@/interfaces/repositories/establishment-repository.js";
import type { hubListEstablishmentsQuerySchema } from "@/schemas/hub-schema.js";
import { mapHubEstablishments } from "@/services/hub/map-hub-establishment.js";
import type {
  CursorPaginatedResponse,
  PaginatedResponse,
} from "@/types/crud.js";
import type { HubEstablishmentCard, HubListFilter } from "@/types/hub.js";

type ListHubEstablishmentsServiceRequest = z.infer<
  typeof hubListEstablishmentsQuerySchema
>;

type ListHubEstablishmentsServiceResponse =
  | PaginatedResponse<HubEstablishmentCard>
  | CursorPaginatedResponse<HubEstablishmentCard>;

export class ListHubEstablishmentsService {
  private establishmentRepository: IEstablishmentRepository;

  constructor(establishmentRepository: IEstablishmentRepository) {
    this.establishmentRepository = establishmentRepository;
  }

  async handle({
    paginationMode,
    page,
    perPage,
    limit,
    cursor,
    search,
    cuisine,
    openNow,
  }: ListHubEstablishmentsServiceRequest): Promise<ListHubEstablishmentsServiceResponse> {
    const filter: HubListFilter = { search, cuisine };

    if (openNow)
      return await this.handleOpenNow({
        paginationMode,
        page,
        perPage,
        limit,
        cursor,
        filter,
      });

    if (paginationMode === "cursor")
      return await this.handleCursor({ limit, cursor, filter });

    return await this.handleOffset({ page, perPage, filter });
  }

  private filterPrefixKey(filter: HubListFilter): string {
    const cache = makeCache();
    const parts: string[] = [];

    if (filter.search) parts.push(`search_${filter.search}`);
    if (filter.cuisine) parts.push(`cuisine_${filter.cuisine}`);

    const prefix = parts.length > 0 ? `${parts.join("_")}_` : "";

    return `${prefix}hub_${cache.keys.establishments}_`;
  }

  private async handleOffset({
    page,
    perPage,
    filter,
  }: {
    page?: number;
    perPage: number;
    filter: HubListFilter;
  }): Promise<PaginatedResponse<HubEstablishmentCard>> {
    const cache = makeCache();
    const prefixKey = this.filterPrefixKey(filter);
    const currentPage = page ?? 1;
    const key = `${prefixKey}offset_page_${currentPage}_per_page_${perPage}`;

    const [total, establishments] = await Promise.all([
      cache.remember(
        `${prefixKey}total`,
        Constants.CACHE_TTL.establishments,
        async () => await this.establishmentRepository.countListedForHub(filter),
        { domain: "establishments" },
      ),
      cache.remember(
        key,
        Constants.CACHE_TTL.establishments,
        async () =>
          await this.establishmentRepository.paginateListedForHub({
            page: currentPage,
            perPage,
            filter,
          }),
        { domain: "establishments" },
      ),
    ]);

    const totalPages = Math.ceil(total / perPage);

    if (currentPage > totalPages && totalPages > 0) {
      await cache.forget(key);
      throw new InvalidPage();
    }

    return {
      items: mapHubEstablishments(establishments),
      pagination: {
        page: currentPage,
        perPage,
        total,
        totalPages,
      },
    };
  }

  private async handleCursor({
    limit,
    cursor,
    filter,
  }: {
    limit: number;
    cursor?: string | null;
    filter: HubListFilter;
  }): Promise<CursorPaginatedResponse<HubEstablishmentCard>> {
    const cache = makeCache();
    const prefixKey = this.filterPrefixKey(filter);
    const cursorSuffix = cursor ? `_cursor_${cursor}` : "";
    const key = `${prefixKey}cursor_limit_${limit}${cursorSuffix}`;

    const raw = await cache.remember(
      key,
      Constants.CACHE_TTL.establishments,
      async () =>
        await this.establishmentRepository.cursorPaginateListedForHub({
          limit,
          cursor,
          filter,
        }),
      { domain: "establishments" },
    );

    const hasNextPage = raw.length > limit;
    const pageItems = hasNextPage ? raw.slice(0, limit) : raw;
    const nextCursor = hasNextPage
      ? pageItems[pageItems.length - 1].id
      : null;

    if (pageItems.length <= 0) await cache.forget(key);

    return {
      items: mapHubEstablishments(pageItems),
      pagination: {
        nextCursor,
        hasNextPage: !!nextCursor,
      },
    };
  }

  private async handleOpenNow({
    paginationMode,
    page,
    perPage,
    limit,
    cursor,
    filter,
  }: {
    paginationMode: "offset" | "cursor";
    page?: number;
    perPage: number;
    limit: number;
    cursor?: string | null;
    filter: HubListFilter;
  }): Promise<ListHubEstablishmentsServiceResponse> {
    const cache = makeCache();
    const prefixKey = this.filterPrefixKey(filter);

    const all = await cache.remember(
      `${prefixKey}all_listed`,
      Constants.CACHE_TTL.establishments,
      async () => await this.establishmentRepository.listAllListedForHub(filter),
      { domain: "establishments" },
    );

    const open = mapHubEstablishments(all).filter((item) => item.isOpen);

    if (paginationMode === "cursor") {
      const sorted = [...open].sort((a, b) => a.id.localeCompare(b.id));
      const startIndex = cursor
        ? sorted.findIndex((item) => item.id === cursor) + 1
        : 0;
      const slice = sorted.slice(startIndex, startIndex + limit + 1);
      const hasNextPage = slice.length > limit;
      const pageItems = hasNextPage ? slice.slice(0, limit) : slice;
      const nextCursor = hasNextPage
        ? pageItems[pageItems.length - 1].id
        : null;

      return {
        items: pageItems,
        pagination: {
          nextCursor,
          hasNextPage: !!nextCursor,
        },
      };
    }

    const currentPage = page ?? 1;
    const total = open.length;
    const totalPages = Math.ceil(total / perPage);

    if (currentPage > totalPages && totalPages > 0) throw new InvalidPage();

    return {
      items: open.slice((currentPage - 1) * perPage, currentPage * perPage),
      pagination: {
        page: currentPage,
        perPage,
        total,
        totalPages,
      },
    };
  }
}
