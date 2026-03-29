/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IJob<T = any> {
	name: string;
	data: T;
	options?: any;
}

export interface IQueueProvider {
	add<T = any>(job: IJob<T>): Promise<void>;
	process(processFunction: (job: any) => Promise<void>): void;
}
