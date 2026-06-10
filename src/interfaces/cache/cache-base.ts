import type { CacheTagScope } from "@/types/cache.js";

export interface ICacheBase {
  set(key: string, value: unknown, duration?: number): Promise<void>;
  get<T>(key: string): Promise<T | null>;
  forget(key: string): Promise<void>;
  flush(): Promise<void>;
  forgetKeysContaining(key: string): Promise<void>;
  invalidateDomain(scope: CacheTagScope): Promise<void>;
  remember<T>(
    key: string,
    duration: number,
    fetchFunction: () => Promise<T>,
    scope?: CacheTagScope,
  ): Promise<T>;
}
