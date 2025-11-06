import { EventEmitter } from "node:events";

export class TypedEventEmitter<Events extends Record<string, any>> {
	private emitter = new EventEmitter();

	on<K extends keyof Events>(
		event: K,
		listener: (payload: Events[K]) => void | Promise<void>
	): void {
		this.emitter.on(event as string, listener);
	}

	off<K extends keyof Events>(
		event: K,
		listener: (payload: Events[K]) => void | Promise<void>
	): void {
		this.emitter.off(event as string, listener);
	}

	emit<K extends keyof Events>(event: K, payload: Events[K]): void {
		this.emitter.emit(event as string, payload);
	}
}
