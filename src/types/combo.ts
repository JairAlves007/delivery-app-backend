import type { Prisma } from "@/generated/prisma/client.js";

export type ComboWithRelations = Prisma.ComboGetPayload<{
  include: {
    items: {
      include: { product: { select: { id: true; name: true; price: true } } };
    };
    groups: {
      include: {
        options: {
          include: {
            product: { select: { id: true; name: true; price: true } };
          };
        };
      };
    };
    resources: { include: { resource: true } };
  };
}>;

export type ComboForOrder = Prisma.ComboGetPayload<{
  include: {
    items: {
      include: { product: { select: { id: true; name: true } } };
    };
    groups: {
      include: {
        options: {
          include: { product: { select: { id: true; name: true } } };
        };
      };
    };
  };
}>;

export type ComboToProcess = {
  comboId: string;
  comboName: string;
  comboPriceCents: number;
  quantity: number;
  selections: {
    productId: string;
    productName: string;
    quantity: number;
    additionalPriceCents: number;
  }[];
};

export type ComboOrderInput = {
  comboId: string;
  quantity: number;
  selections: { productId: string }[];
};
