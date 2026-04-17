import { makeCache } from "@/factories/services/cache/make-cache.js";
import {
	DeliveryType,
	OrderStatusType,
	PaymentMethodType
} from "@/generated/prisma/client.js";
import Constants from "@/helpers/constants.js";
import type { IDashboardRepository } from "@/interfaces/repositories/dashboard-repository.js";
import type {
	DashboardBucketRow,
	DashboardDeliveryTypeRow,
	DashboardGranularity,
	DashboardPaymentMethodRow,
	DashboardResponse,
	DashboardServiceInput,
	DashboardStatusRow
} from "@/types/dashboard.js";

const DEFAULT_RANGE_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

const resolveRange = (from?: Date, to?: Date): { from: Date; to: Date } => {
	const resolvedTo = to ?? new Date();
	const resolvedFrom =
		from ?? new Date(resolvedTo.getTime() - DEFAULT_RANGE_DAYS * DAY_MS);
	return { from: resolvedFrom, to: resolvedTo };
};

const pad = (value: number) => value.toString().padStart(2, "0");

const formatDateKey = (date: Date) =>
	`${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;

const getBucketIncrement = (granularity: DashboardGranularity, date: Date) => {
	const next = new Date(date.getTime());
	if (granularity === "day") {
		next.setUTCDate(next.getUTCDate() + 1);
		return next;
	}
	if (granularity === "week") {
		next.setUTCDate(next.getUTCDate() + 7);
		return next;
	}
	next.setUTCMonth(next.getUTCMonth() + 1);
	return next;
};

const alignToBucketStart = (
	granularity: DashboardGranularity,
	date: Date
): Date => {
	const aligned = new Date(
		Date.UTC(
			date.getUTCFullYear(),
			date.getUTCMonth(),
			date.getUTCDate(),
			0,
			0,
			0,
			0
		)
	);
	if (granularity === "week") {
		const day = aligned.getUTCDay();
		const diffToMonday = (day + 6) % 7;
		aligned.setUTCDate(aligned.getUTCDate() - diffToMonday);
	}
	if (granularity === "month") {
		aligned.setUTCDate(1);
	}
	return aligned;
};

const zeroFillBuckets = (
	granularity: DashboardGranularity,
	from: Date,
	to: Date,
	rows: DashboardBucketRow[]
): DashboardBucketRow[] => {
	const byBucket = new Map(rows.map(row => [row.bucket, row]));
	const buckets: DashboardBucketRow[] = [];

	let cursor = alignToBucketStart(granularity, from);
	const end = alignToBucketStart(granularity, to);

	while (cursor.getTime() <= end.getTime()) {
		const key = formatDateKey(cursor);
		const existing = byBucket.get(key);
		buckets.push(
			existing ?? {
				bucket: key,
				orders: 0,
				revenue: 0
			}
		);
		cursor = getBucketIncrement(granularity, cursor);
	}

	return buckets;
};

const zeroFillStatuses = (
	rows: DashboardStatusRow[]
): DashboardStatusRow[] => {
	const byStatus = new Map(rows.map(row => [row.status, row]));
	return Object.values(OrderStatusType).map(
		status => byStatus.get(status) ?? { status, count: 0, revenue: 0 }
	);
};

const zeroFillPaymentMethods = (
	rows: DashboardPaymentMethodRow[]
): DashboardPaymentMethodRow[] => {
	const byMethod = new Map(rows.map(row => [row.method, row]));
	return Object.values(PaymentMethodType).map(
		method => byMethod.get(method) ?? { method, count: 0, revenue: 0 }
	);
};

const zeroFillDeliveryTypes = (
	rows: DashboardDeliveryTypeRow[]
): DashboardDeliveryTypeRow[] => {
	const byType = new Map(rows.map(row => [row.type, row]));
	return Object.values(DeliveryType).map(
		type => byType.get(type) ?? { type, count: 0, revenue: 0 }
	);
};

export class GetDashboardService {
	private dashboardRepository: IDashboardRepository;

	constructor(dashboardRepository: IDashboardRepository) {
		this.dashboardRepository = dashboardRepository;
	}

	async handle(input: DashboardServiceInput): Promise<DashboardResponse> {
		const { from, to } = resolveRange(input.from, input.to);
		const { granularity, establishmentId, isAdmin } = input;
		const cache = makeCache();

		const scopeKey = establishmentId ?? "global";
		const roleKey = isAdmin ? "admin" : "owner";
		const cacheKey = `${cache.keys.dashboard}_${scopeKey}_${from.toISOString()}_${to.toISOString()}_${granularity}_${roleKey}`;

		return await cache.remember(
			cacheKey,
			Constants.CACHE_TTL.dashboard,
			async () =>
				await this.build({
					from,
					to,
					granularity,
					establishmentId,
					isAdmin
				})
		);
	}

	private async build({
		from,
		to,
		granularity,
		establishmentId,
		isAdmin
	}: {
		from: Date;
		to: Date;
		granularity: DashboardGranularity;
		establishmentId?: string;
		isAdmin: boolean;
	}): Promise<DashboardResponse> {
		const limit = Constants.DASHBOARD_TOP_N;
		const scopedRange = { from, to, establishmentId };
		const isScopedToEstablishment = Boolean(establishmentId);
		const isAdminGlobal = isAdmin && !establishmentId;

		const [
			summary,
			ordersOverTimeRaw,
			ordersByStatusRaw,
			ordersByPaymentMethodRaw,
			ordersByDeliveryTypeRaw,
			topProducts,
			topCategories,
			topCustomers,
			couponsUsage,
			topEstablishments,
			establishmentsCount,
			usersCount
		] = await Promise.all([
			this.dashboardRepository.getSummary(scopedRange),
			this.dashboardRepository.getOrdersOverTime({
				...scopedRange,
				granularity
			}),
			this.dashboardRepository.getOrdersByStatus(scopedRange),
			this.dashboardRepository.getOrdersByPaymentMethod(scopedRange),
			this.dashboardRepository.getOrdersByDeliveryType(scopedRange),
			this.dashboardRepository.getTopProducts({ ...scopedRange, limit }),
			this.dashboardRepository.getTopCategories({ ...scopedRange, limit }),
			isScopedToEstablishment
				? this.dashboardRepository.getTopCustomers({
						from,
						to,
						establishmentId: establishmentId as string,
						limit
					})
				: Promise.resolve(null),
			this.dashboardRepository.getCouponsUsage({ ...scopedRange, limit }),
			isAdminGlobal
				? this.dashboardRepository.getTopEstablishments({ from, to, limit })
				: Promise.resolve(null),
			isAdminGlobal
				? this.dashboardRepository.getEstablishmentsCount()
				: Promise.resolve(null),
			isAdminGlobal
				? this.dashboardRepository.getCustomersCount()
				: Promise.resolve(null)
		]);

		return {
			currency: "BRL",
			range: {
				from: from.toISOString(),
				to: to.toISOString(),
				granularity,
				timezone: Constants.DASHBOARD_TIMEZONE
			},
			scope: {
				type: isScopedToEstablishment ? "ESTABLISHMENT" : "GLOBAL",
				establishmentId: establishmentId ?? null
			},
			summary,
			ordersOverTime: zeroFillBuckets(granularity, from, to, ordersOverTimeRaw),
			ordersByStatus: zeroFillStatuses(ordersByStatusRaw),
			ordersByPaymentMethod: zeroFillPaymentMethods(ordersByPaymentMethodRaw),
			ordersByDeliveryType: zeroFillDeliveryTypes(ordersByDeliveryTypeRaw),
			topProducts,
			topCategories,
			topCustomers,
			couponsUsage,
			topEstablishments,
			establishmentsCount,
			usersCount
		};
	}
}
