/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IJob<T = any> {
  name: string;
  data: T;
  options?: any;
}

export interface IRepeatableJob<T = any> {
  schedulerId: string;
  pattern: string;
  tz?: string;
  job: IJob<T>;
}

export interface IFinalFailure<T = any> {
  jobId?: string;
  data: T;
  error: Error;
}

export interface IProcessorOptions<T = any> {
  concurrency?: number;
  onFinalFailure?: (failure: IFinalFailure<T>) => Promise<void> | void;
}

export interface IQueueProvider {
  add<T = any>(job: IJob<T>): Promise<void>;
  scheduleRepeatable<T = any>(repeatable: IRepeatableJob<T>): Promise<void>;
  process(
    processFunction: (job: any) => Promise<void>,
    options?: IProcessorOptions,
  ): void;
  close(): Promise<void>;
}
