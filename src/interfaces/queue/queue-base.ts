/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IJob<T = any> {
  name: string;
  data: T;
  options?: any;
}

export interface IRepeatableJob<T = any> {
  schedulerId: string;
  pattern: string;
  job: IJob<T>;
}

export interface IQueueProvider {
  add<T = any>(job: IJob<T>): Promise<void>;
  scheduleRepeatable<T = any>(repeatable: IRepeatableJob<T>): Promise<void>;
  process(processFunction: (job: any) => Promise<void>): void;
}
