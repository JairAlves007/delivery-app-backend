import type {
  OrderStatusMessageTemplate,
  OrderStatusType,
} from "@/generated/prisma/client.js";

export type UpsertOrderStatusMessageTemplateParams = {
  establishmentId: string;
  status: OrderStatusType;
  body: string;
  isActive?: boolean;
};

export interface IOrderStatusMessageTemplateRepository {
  findByEstablishmentAndStatus(params: {
    establishmentId: string;
    status: OrderStatusType;
  }): Promise<OrderStatusMessageTemplate | null>;
  listByEstablishment(
    establishmentId: string,
  ): Promise<OrderStatusMessageTemplate[]>;
  upsert(
    params: UpsertOrderStatusMessageTemplateParams,
  ): Promise<OrderStatusMessageTemplate>;
  softDelete(params: {
    establishmentId: string;
    status: OrderStatusType;
  }): Promise<void>;
}
