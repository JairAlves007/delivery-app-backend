import { BaseQueue } from "@/classes/queue.js";

export const makeQueue = <T>(name: string): BaseQueue<T> => {
	return BaseQueue.getInstance<T>(name);
};
