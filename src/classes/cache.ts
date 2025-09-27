import type { ICacheBase } from "@/interfaces/cache/cache-base.ts";
import { redis } from "@/lib/redis.ts";

export class Cache implements ICacheBase {
	private static instance: Cache | null = null;

	readonly keys = {
		products: "products",
		productCategories: "product_categories",
		establishments: "establishments",
		districts: "districts",
		coupons: "coupons",
		banners: "banners",
		addons: "addons",
		addonCategories: "addon_categories",
		profile: "profile",
		users: "users",
		menus: "menus",
		addresses: "addresses"
	};

	static getInstance() {
		if (!this.instance) this.instance = new Cache();
		return this.instance;
	}

	async set(key: string, value: any, duration?: number) {
		try {
			if (duration) {
				await redis.set(key, JSON.stringify(value), "EX", duration);
				return;
			}

			await redis.set(key, JSON.stringify(value));
		} catch (error) {
			console.error(`Error setting ${key} in cache:`, error);
			throw error;
		}
	}

	async get<T>(key: string): Promise<T | null> {
		try {
			const value = await redis.get(key);

			if (!value) return null;

			return JSON.parse(value) as T;
		} catch (error) {
			console.error(`Error getting ${key} from cache:`, error);
			throw error;
		}
	}

	async forget(key: string) {
		try {
			await redis.del(key);
		} catch (error) {
			console.error(`Error forgetting ${key} from cache:`, error);
			throw error;
		}
	}

	async flush() {
		try {
			await redis.flushall();
		} catch (error) {
			console.error("Error flushing cache:", error);
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
			console.error(
				`Error forgetting keys containing ${key} from cache:`,
				error
			);
			throw error;
		}
	}

	async rememberForever<T>(
		key: string,
		fetchFunction: () => Promise<T>
	): Promise<T> {
		try {
			const cachedValue = await this.get<T>(key);

			if (!!cachedValue) return cachedValue;

			const value = await fetchFunction();
			await this.set(key, value);

			return value;
		} catch (error) {
			console.error(`Error setting ${key} in cache:`, error);
			throw error;
		}
	}

	async remember<T>(
		key: string,
		duration: number,
		fetchFunction: () => Promise<T>
	): Promise<T> {
		try {
			const cachedValue = await this.get<T>(key);

			if (!!cachedValue) return cachedValue;

			const value = await fetchFunction();
			await this.set(key, value, duration);

			return value;
		} catch (error) {
			console.error(
				`Error setting ${key} in cache with duration ${duration}:`,
				error
			);
			throw error;
		}
	}
}
