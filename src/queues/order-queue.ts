import { createHash } from "node:crypto";

import { makeQueue } from "@/factories/services/queue/make-queue.js";
import type { CreateOrderParams } from "@/types/order.js";

export const orderQueueName = "order-queue";

const buildOrderJobId = ({ order }: CreateOrderParams): string => {
  const items = [...order.items]
    .map((item) => ({
      id: item.id,
      quantity: item.quantity,
      addonCategories: (item.addonCategories ?? [])
        .map((c) => ({
          id: c.id,
          addons: [...c.addons]
            .sort((a, b) => a.id - b.id)
            .map((a) => `${a.id}:${a.quantity}`)
            .join(","),
        }))
        .sort((a, b) => a.id - b.id),
    }))
    .sort((a, b) => a.id.localeCompare(b.id));

  const payload = JSON.stringify({
    userId: order.userId,
    establishmentId: order.establishmentId,
    deliveryType: order.deliveryType,
    paymentMethod: order.paymentMethod,
    addressId: order.addressId ?? null,
    districtId: order.districtId ?? null,
    couponId: order.couponId ?? null,
    changeAmount: order.changeAmount ?? null,
    items,
  });

  return `create-order-${createHash("sha1").update(payload).digest("hex")}`;
};

export const createOrderQueue = async (payload: CreateOrderParams) => {
  const queue = makeQueue<CreateOrderParams>(orderQueueName);

  await queue.enqueue("create-order", payload, {
    jobId: buildOrderJobId(payload),
  });
};
