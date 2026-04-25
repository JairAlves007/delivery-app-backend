import z from "zod";

import { InvalidPage } from "@/errors/pagination/invalid-page.js";
import type { TagType } from "@/generated/prisma/client.js";
import type { ITagRepository } from "@/interfaces/repositories/tag-repository.js";
import { listQueryParamsSchema } from "@/schemas/generic-schema.js";
import { mapTagWithCombinations } from "@/services/tag/map-tag.js";
import type {
  FilterField,
  FilterParams,
  PaginatedResponse,
} from "@/types/crud.js";
import type { TagDetail } from "@/types/tag.js";

type ListTagServiceRequest = z.infer<typeof listQueryParamsSchema> &
  FilterField & {
    type?: TagType;
  };

type ListTagServiceResponse = PaginatedResponse<TagDetail>;

export class ListTagService {
  private tagRepository: ITagRepository;

  constructor(tagRepository: ITagRepository) {
    this.tagRepository = tagRepository;
  }

  async handle({
    page,
    perPage,
    filterParams,
    type,
  }: ListTagServiceRequest): Promise<ListTagServiceResponse> {
    const mergedParams = {
      ...filterParams,
      ...(type ? { type } : {}),
    } as FilterParams;

    const total = await this.tagRepository.count(mergedParams);
    const isPaging = !!page;

    if (isPaging) {
      const tags = await this.tagRepository.paginate({
        page,
        perPage,
        filterParams: mergedParams,
      });

      const totalPages = Math.ceil(total / perPage);

      if (page > totalPages && totalPages > 0) throw new InvalidPage();

      return {
        items: tags.map(mapTagWithCombinations),
        pagination: {
          page,
          perPage,
          total,
          totalPages,
        },
      };
    }

    const tags = await this.tagRepository.listAll(mergedParams);

    return {
      items: tags.map(mapTagWithCombinations),
      pagination: {
        page: 1,
        perPage: total,
        total,
        totalPages: 1,
      },
    };
  }
}
