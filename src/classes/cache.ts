import Constants from "@/helpers/constants.js";
import { app } from "@/http/app.js";
import type { ICacheBase } from "@/interfaces/cache/cache-base.js";
import { redis } from "@/lib/redis.js";
import type {
	CacheKeys,
	CacheTagScope,
	ForgetAllListingCacheKeysParams
} from "@/types/cache.js";

export class Cache implements ICacheBase {
	private static instance: Cache | null = null;

	readonly keys = Constants.CACHE_KEYS;

	static getInstance() {
		if (!this.instance) this.instance = new Cache();
		return this.instance;
	}

	async ping() {
		await redis.ping();
	}

	private tagSetKey(domain: CacheKeys, establishmentId?: string | null) {
		const base = `cachetag:${this.keys[domain]}`;
		return establishmentId ? `${base}:est_${establishmentId}` : base;
	}

	private async registerKey(key: string, scope: CacheTagScope) {
		try {
			const setKey = this.tagSetKey(scope.domain, scope.establishmentId);

			await redis.sadd(setKey, key);
			await redis.expire(setKey, Constants.CACHE_TAG_SET_TTL_SECONDS);
		} catch (error) {
			app.log.error({ error }, `Error registering ${key} in cache tag set`);
		}
	}

	async set(key: string, value: unknown, duration?: number) {
		try {
			if (duration) {
				await redis.set(key, JSON.stringify(value), "EX", duration);
				return;
			}

			await redis.set(key, JSON.stringify(value));
		} catch (error) {
			app.log.error({ error }, `Error setting ${key} in cache`);
			throw error;
		}
	}

	async get<T>(key: string): Promise<T | null> {
		try {
			const value = await redis.get(key);

			if (!value) return null;

			return JSON.parse(value) as T;
		} catch (error) {
			app.log.error({ error }, `Error getting ${key} from cache`);
			throw error;
		}
	}

	async forget(key: string) {
		try {
			await redis.del(key);
		} catch (error) {
			app.log.error({ error }, `Error forgetting ${key} from cache`);
			throw error;
		}
	}

	async flush() {
		try {
			await redis.flushall();
		} catch (error) {
			app.log.error({ error }, "Error flushing cache");
			throw error;
		}
	}

	async forgetKeysContaining(key: string) {
		try {
			let cursor = "0";

			do {
				const [nextCursor, keys] = await redis.scan(
					cursor,
					"MATCH",
					`*${key}*`,
					"COUNT",
					100
				);
				cursor = nextCursor;

				if (keys.length > 0) await redis.del(...keys);
			} while (cursor !== "0");
		} catch (error) {
			app.log.error(
				{ error },
				`Error forgetting keys containing ${key} from cache`
			);
			throw error;
		}
	}

	async invalidateDomain({ domain, establishmentId }: CacheTagScope) {
		try {
			const setKeys = [this.tagSetKey(domain)];

			if (establishmentId) setKeys.push(this.tagSetKey(domain, establishmentId));

			for (const setKey of setKeys) {
				const keys = await redis.smembers(setKey);

				if (keys.length > 0) await redis.del(...keys);

				await redis.del(setKey);
			}
		} catch (error) {
			app.log.error(
				{ error },
				`Error invalidating cache domain ${domain}${establishmentId ? ` (establishment ${establishmentId})` : ""}`
			);
			throw error;
		}
	}

	async remember<T>(
		key: string,
		duration: number,
		fetchFunction: () => Promise<T>,
		scope?: CacheTagScope
	): Promise<T> {
		try {
			const cachedValue = await this.get<T>(key);

			if (cachedValue !== null) return cachedValue;

			const lockKey = `${key}:lock`;
			const lockAcquired = await redis.set(
				lockKey,
				"1",
				"EX",
				Constants.CACHE_LOCK_TTL_SECONDS,
				"NX"
			);

			if (!lockAcquired) {
				for (let attempt = 0; attempt < Constants.CACHE_LOCK_MAX_RETRIES; attempt++) {
					await new Promise(resolve =>
						setTimeout(resolve, Constants.CACHE_LOCK_RETRY_DELAY_MS)
					);

					const value = await this.get<T>(key);
					if (value !== null) return value;
				}

				return await fetchFunction();
			}

			try {
				const value = await fetchFunction();
				await this.set(key, value, duration);

				if (scope) await this.registerKey(key, scope);

				return value;
			} finally {
				await redis.del(lockKey);
			}
		} catch (error) {
			app.log.error(
				{ error },
				`Error setting ${key} in cache with duration ${duration}`
			);
			throw error;
		}
	}

	async forgetAllListingCacheKeys({
		baseCacheKey,
		paramsToForget
	}: ForgetAllListingCacheKeysParams) {
		const establishmentId = paramsToForget?.establishment_id ?? null;

		await this.invalidateDomain({
			domain: baseCacheKey,
			establishmentId
		});

		if (!establishmentId) {
			await this.forgetKeysContaining(this.keys[baseCacheKey]);
		}
	}
}
