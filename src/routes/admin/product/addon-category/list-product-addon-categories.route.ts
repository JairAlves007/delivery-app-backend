import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeListProductAddonCategoriesService } from "@/factories/services/product-addon-category/make-list-product-addon-categories-service.js";
import {
  AddonPricingStrategy,
  AddonType,
  PermissionType,
} from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import { getUserEstablishmentId } from "@/helpers/get-user-establishment-id.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { transformPriceFromDatabase } from "@/helpers/price.js";
import { adminTags } from "@/http/swagger-tags.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import {
  apiDefaultErrorResponseSchema,
  apiSuccessResponseSchema,
} from "@/schemas/api-schema.js";
import { productIdParamsSchema } from "@/schemas/product-addon-category-schema.js";

const productAddonCategoryItemSchema = z.object({
  id: z.number(),
  category_id: z.number(),
  display_order: z.number(),
  is_required: z.boolean(),
  min_selection: z.number().nullable(),
  max_selection: z.number().nullable(),
  category: z.object({
    id: z.number(),
    name: z.string(),
    type: z.enum(AddonType),
    pricing_strategy: z.enum(AddonPricingStrategy),
    parts_count: z.number().nullable(),
    addons: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        price: z.number(),
      }),
    ),
  }),
});

const listProductAddonCategoriesResponseSchema = z.array(
  productAddonCategoryItemSchema,
);

export const listProductAddonCategoriesRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/:productId/addon-categories",
    {
      schema: {
        operationId: "listProductAddonCategories",
        tags: adminTags("Product Addon Categories"),
        summary: "Listar categorias vinculadas a um produto",
        params: productIdParamsSchema,
        response: {
          200: apiSuccessResponseSchema(
            listProductAddonCategoriesResponseSchema,
          ),
          401: apiDefaultErrorResponseSchema,
          403: apiDefaultErrorResponseSchema,
          404: apiDefaultErrorResponseSchema,
          500: apiDefaultErrorResponseSchema,
        },
      },
      onRequest: [
        isAuthenticated,
        ensureUserHasPermission([PermissionType.MANAGE_PRODUCTS]),
      ],
    },
    async (request, reply) => {
      const { productId } = request.params;
      const establishmentId = getUserEstablishmentId(request.user);

      const service = makeListProductAddonCategoriesService();

      const items = await service.handle({ productId, establishmentId });

      const payload = items.map((item) => ({
        id: item.id,
        category_id: item.addon_category_id,
        display_order: item.display_order,
        is_required: item.is_required,
        min_selection: item.min_selection,
        max_selection: item.max_selection,
        category: {
          id: item.addonCategory.id,
          name: item.addonCategory.name,
          type: item.addonCategory.type,
          pricing_strategy: item.addonCategory.pricing_strategy,
          parts_count: item.addonCategory.parts_count,
          addons: item.addonCategory.addons.map((addon) => ({
            id: addon.id,
            name: addon.name,
            price: transformPriceFromDatabase(addon.price),
          })),
        },
      }));

      return reply
        .status(HTTPStatusCodes.OK)
        .send(ApiResponse.success("Vínculos carregados com sucesso", payload));
    },
  );
};
