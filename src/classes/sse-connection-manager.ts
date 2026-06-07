import type { ServerResponse } from "node:http";

import Constants from "@/helpers/constants.js";
import {
  buildNotificationChannel,
  notificationSubscriber,
} from "@/lib/redis-pubsub.js";

export class SseConnectionManager {
  private static instance: SseConnectionManager;
  private connections: Map<string, Set<ServerResponse>> = new Map();
  private listenerBound = false;

  private constructor() {}

  public static getInstance(): SseConnectionManager {
    if (!this.instance) {
      this.instance = new SseConnectionManager();
    }
    return this.instance;
  }

  private bindListener(): void {
    if (this.listenerBound) return;
    this.listenerBound = true;

    notificationSubscriber.on("message", (channel: string, message: string) => {
      const establishmentId = channel.slice(
        Constants.NOTIFICATION_CHANNEL_PREFIX.length,
      );

      this.broadcast(establishmentId, message);
    });
  }

  async add(establishmentId: string, response: ServerResponse): Promise<void> {
    this.bindListener();

    const existing = this.connections.get(establishmentId);

    if (existing) {
      existing.add(response);
      return;
    }

    this.connections.set(establishmentId, new Set([response]));
    await notificationSubscriber.subscribe(
      buildNotificationChannel(establishmentId),
    );
  }

  async remove(
    establishmentId: string,
    response: ServerResponse,
  ): Promise<void> {
    const responses = this.connections.get(establishmentId);
    if (!responses) return;

    responses.delete(response);

    if (responses.size > 0) return;

    this.connections.delete(establishmentId);
    await notificationSubscriber.unsubscribe(
      buildNotificationChannel(establishmentId),
    );
  }

  broadcast(establishmentId: string, data: string): void {
    const responses = this.connections.get(establishmentId);
    if (!responses) return;

    for (const response of responses) {
      try {
        response.write(`event: notification\ndata: ${data}\n\n`);
      } catch {
        responses.delete(response);
      }
    }
  }
}
