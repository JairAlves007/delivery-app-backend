import { BaseQueue } from "@/classes/queue.ts";

export const makeQueue = <T>(name: string): BaseQueue<T> => {
	return BaseQueue.getInstance<T>(name);
};
