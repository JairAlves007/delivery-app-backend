export interface ICacheBase {
  set(key: string, value: unknown, duration?: number): Promise<void>;
  get<T>(key: string): Promise<T | null>;
  forget(key: string): Promise<void>;
  flush(): Promise<void>;
  forgetKeysContaining(key: string): Promise<void>;
  rememberForever<T>(key: string, fetchFunction: () => Promise<T>): Promise<T>;
  remember<T>(
    key: string,
    duration: number,
    fetchFunction: () => Promise<T>,
  ): Promise<T>;
}
