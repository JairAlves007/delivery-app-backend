import {
	type DeliveryType,
	type OrderStatusType,
	type PaymentMethodType,
	Prisma,
	RoleType
} from "@/generated/prisma/client.js";
import Constants from "@/helpers/constants.js";
import type { IDashboardRepository } from "@/interfaces/repositories/dashboard-repository.js";
import prisma from "@/lib/prisma.js";
import type {
	DashboardBucketRow,
	DashboardCouponUsageRow,
	DashboardDeliveryTypeRow,
	DashboardGranularity,
	DashboardOrdersOverTimeInput,
	DashboardPaymentMethodRow,
	DashboardRepositoryInput,
	DashboardStatusRow,
	DashboardSummaryRow,
	DashboardTopCategoryRow,
	DashboardTopCustomerRow,
	DashboardTopEstablishmentRow,
	DashboardTopNInput,
	DashboardTopProductRow
} from "@/types/dashboard.js";

const buildEstablishmentFilter = (establishmentId?: string) =>
	establishmentId
		? Prisma.sql`AND o.establishment_id = ${establishmentId}`
		: Prisma.empty;

const granularityToSql = (granularity: DashboardGranularity) => {
	switch (granularity) {
		case "week":
			return Prisma.sql`'week'`;
		case "month":
			return Prisma.sql`'month'`;
		default:
			return Prisma.sql`'day'`;
	}
};

export class DashboardPrismaRepository implements IDashboardRepository {
	async getSummary({
		establishmentId,
		from,
		to
	}: DashboardRepositoryInput): Promise<DashboardSummaryRow> {
		const establishmentFilter = buildEstablishmentFilter(establishmentId);

		const rows = await prisma.$queryRaw<
			{
				total_orders: number;
				paid_orders: number;
				cancelled_orders: number;
				gross_revenue: number;
				discounts_total: number;
				shipping_total: number;
				net_revenue: number;
				average_order_value: number;
				distinct_customers: number;
			}[]
		>`
			WITH scoped_orders AS (
				SELECT
					o.id,
					o.user_id,
					o.subtotal,
					o.shipping_fee,
					COALESCE(oc.discount_value, 0) AS discount_value
				FROM orders o
				LEFT JOIN order_coupons oc ON oc.order_id = o.id
				WHERE o.deleted_at IS NULL
					AND o.created_at >= ${from}
					AND o.created_at <  ${to}
					${establishmentFilter}
			),
			latest_status AS (
				SELECT DISTINCT ON (order_id)
					order_id,
					value AS status
				FROM order_statuses
				WHERE order_id IN (SELECT id FROM scoped_orders)
				ORDER BY order_id, created_at DESC
			),
			joined AS (
				SELECT
					so.*,
					ls.status,
					(so.subtotal + so.shipping_fee - so.discount_value) AS net_total
				FROM scoped_orders so
				JOIN latest_status ls ON ls.order_id = so.id
			)
			SELECT
				COUNT(*)::int AS total_orders,
				COUNT(*) FILTER (WHERE status <> 'CANCELLED')::int AS paid_orders,
				COUNT(*) FILTER (WHERE status = 'CANCELLED')::int  AS cancelled_orders,
				COALESCE(SUM(subtotal)       FILTER (WHERE status <> 'CANCELLED'), 0)::int AS gross_revenue,
				COALESCE(SUM(discount_value) FILTER (WHERE status <> 'CANCELLED'), 0)::int AS discounts_total,
				COALESCE(SUM(shipping_fee)   FILTER (WHERE status <> 'CANCELLED'), 0)::int AS shipping_total,
				COALESCE(SUM(net_total)      FILTER (WHERE status <> 'CANCELLED'), 0)::int AS net_revenue,
				COALESCE(ROUND(AVG(net_total) FILTER (WHERE status <> 'CANCELLED')), 0)::int AS average_order_value,
				COUNT(DISTINCT user_id) FILTER (WHERE status <> 'CANCELLED')::int AS distinct_customers
			FROM joined;
		`;

		const row = rows[0];

		return {
			totalOrders: row?.total_orders ?? 0,
			paidOrders: row?.paid_orders ?? 0,
			cancelledOrders: row?.cancelled_orders ?? 0,
			grossRevenue: row?.gross_revenue ?? 0,
			discountsTotal: row?.discounts_total ?? 0,
			shippingTotal: row?.shipping_total ?? 0,
			netRevenue: row?.net_revenue ?? 0,
			averageOrderValue: row?.average_order_value ?? 0,
			distinctCustomers: row?.distinct_customers ?? 0
		};
	}

	async getOrdersOverTime({
		establishmentId,
		from,
		to,
		granularity
	}: DashboardOrdersOverTimeInput): Promise<DashboardBucketRow[]> {
		const establishmentFilter = buildEstablishmentFilter(establishmentId);
		const granularitySql = granularityToSql(granularity);
		const timezone = Constants.DASHBOARD_TIMEZONE;

		const rows = await prisma.$queryRaw<
			{ bucket: string; orders: number; revenue: number }[]
		>`
			WITH scoped_orders AS (
				SELECT
					o.id,
					o.created_at,
					o.subtotal,
					o.shipping_fee,
					COALESCE(oc.discount_value, 0) AS discount_value
				FROM orders o
				LEFT JOIN order_coupons oc ON oc.order_id = o.id
				WHERE o.deleted_at IS NULL
					AND o.created_at >= ${from}
					AND o.created_at <  ${to}
					${establishmentFilter}
			),
			latest_status AS (
				SELECT DISTINCT ON (order_id)
					order_id,
					value AS status
				FROM order_statuses
				WHERE order_id IN (SELECT id FROM scoped_orders)
				ORDER BY order_id, created_at DESC
			)
			SELECT
				TO_CHAR(
					date_trunc(${granularitySql}, so.created_at AT TIME ZONE ${timezone}),
					'YYYY-MM-DD'
				) AS bucket,
				COUNT(*)::int AS orders,
				COALESCE(SUM(
					CASE
						WHEN ls.status = 'CANCELLED' THEN 0
						ELSE so.subtotal + so.shipping_fee - so.discount_value
					END
				), 0)::int AS revenue
			FROM scoped_orders so
			JOIN latest_status ls ON ls.order_id = so.id
			GROUP BY 1
			ORDER BY 1 ASC;
		`;

		return rows.map(row => ({
			bucket: row.bucket,
			orders: row.orders,
			revenue: row.revenue
		}));
	}

	async getOrdersByStatus({
		establishmentId,
		from,
		to
	}: DashboardRepositoryInput): Promise<DashboardStatusRow[]> {
		const establishmentFilter = buildEstablishmentFilter(establishmentId);

		const rows = await prisma.$queryRaw<
			{ status: OrderStatusType; count: number; revenue: number }[]
		>`
			WITH scoped_orders AS (
				SELECT
					o.id,
					o.subtotal,
					o.shipping_fee,
					COALESCE(oc.discount_value, 0) AS discount_value
				FROM orders o
				LEFT JOIN order_coupons oc ON oc.order_id = o.id
				WHERE o.deleted_at IS NULL
					AND o.created_at >= ${from}
					AND o.created_at <  ${to}
					${establishmentFilter}
			),
			latest_status AS (
				SELECT DISTINCT ON (order_id)
					order_id,
					value AS status
				FROM order_statuses
				WHERE order_id IN (SELECT id FROM scoped_orders)
				ORDER BY order_id, created_at DESC
			)
			SELECT
				ls.status AS status,
				COUNT(*)::int AS count,
				COALESCE(SUM(
					CASE
						WHEN ls.status = 'CANCELLED' THEN 0
						ELSE so.subtotal + so.shipping_fee - so.discount_value
					END
				), 0)::int AS revenue
			FROM scoped_orders so
			JOIN latest_status ls ON ls.order_id = so.id
			GROUP BY ls.status;
		`;

		return rows;
	}

	async getOrdersByPaymentMethod({
		establishmentId,
		from,
		to
	}: DashboardRepositoryInput): Promise<DashboardPaymentMethodRow[]> {
		const establishmentFilter = buildEstablishmentFilter(establishmentId);

		const rows = await prisma.$queryRaw<
			{ method: PaymentMethodType; count: number; revenue: number }[]
		>`
			WITH scoped_orders AS (
				SELECT
					o.id,
					o.payment_method,
					o.subtotal,
					o.shipping_fee,
					COALESCE(oc.discount_value, 0) AS discount_value
				FROM orders o
				LEFT JOIN order_coupons oc ON oc.order_id = o.id
				WHERE o.deleted_at IS NULL
					AND o.created_at >= ${from}
					AND o.created_at <  ${to}
					${establishmentFilter}
			),
			latest_status AS (
				SELECT DISTINCT ON (order_id)
					order_id,
					value AS status
				FROM order_statuses
				WHERE order_id IN (SELECT id FROM scoped_orders)
				ORDER BY order_id, created_at DESC
			)
			SELECT
				so.payment_method AS method,
				COUNT(*)::int AS count,
				COALESCE(SUM(
					CASE
						WHEN ls.status = 'CANCELLED' THEN 0
						ELSE so.subtotal + so.shipping_fee - so.discount_value
					END
				), 0)::int AS revenue
			FROM scoped_orders so
			JOIN latest_status ls ON ls.order_id = so.id
			GROUP BY so.payment_method;
		`;

		return rows;
	}

	async getOrdersByDeliveryType({
		establishmentId,
		from,
		to
	}: DashboardRepositoryInput): Promise<DashboardDeliveryTypeRow[]> {
		const establishmentFilter = buildEstablishmentFilter(establishmentId);

		const rows = await prisma.$queryRaw<
			{ type: DeliveryType; count: number; revenue: number }[]
		>`
			WITH scoped_orders AS (
				SELECT
					o.id,
					o.delivery_type,
					o.subtotal,
					o.shipping_fee,
					COALESCE(oc.discount_value, 0) AS discount_value
				FROM orders o
				LEFT JOIN order_coupons oc ON oc.order_id = o.id
				WHERE o.deleted_at IS NULL
					AND o.created_at >= ${from}
					AND o.created_at <  ${to}
					${establishmentFilter}
			),
			latest_status AS (
				SELECT DISTINCT ON (order_id)
					order_id,
					value AS status
				FROM order_statuses
				WHERE order_id IN (SELECT id FROM scoped_orders)
				ORDER BY order_id, created_at DESC
			)
			SELECT
				so.delivery_type AS type,
				COUNT(*)::int AS count,
				COALESCE(SUM(
					CASE
						WHEN ls.status = 'CANCELLED' THEN 0
						ELSE so.subtotal + so.shipping_fee - so.discount_value
					END
				), 0)::int AS revenue
			FROM scoped_orders so
			JOIN latest_status ls ON ls.order_id = so.id
			GROUP BY so.delivery_type;
		`;

		return rows;
	}

	async getTopProducts({
		establishmentId,
		from,
		to,
		limit
	}: DashboardTopNInput): Promise<DashboardTopProductRow[]> {
		const establishmentFilter = buildEstablishmentFilter(establishmentId);

		const rows = await prisma.$queryRaw<
			{
				product_id: string;
				name: string;
				units_sold: number;
				revenue: number;
			}[]
		>`
			WITH scoped_orders AS (
				SELECT o.id
				FROM orders o
				WHERE o.deleted_at IS NULL
					AND o.created_at >= ${from}
					AND o.created_at <  ${to}
					${establishmentFilter}
			),
			latest_status AS (
				SELECT DISTINCT ON (order_id)
					order_id,
					value AS status
				FROM order_statuses
				WHERE order_id IN (SELECT id FROM scoped_orders)
				ORDER BY order_id, created_at DESC
			)
			SELECT
				oi.product_id AS product_id,
				oi.product_name AS name,
				SUM(oi.quantity)::int AS units_sold,
				SUM(oi.product_price * oi.quantity)::int AS revenue
			FROM order_items oi
			JOIN scoped_orders so ON so.id = oi.order_id
			JOIN latest_status ls ON ls.order_id = oi.order_id
			WHERE ls.status <> 'CANCELLED'
			GROUP BY oi.product_id, oi.product_name
			ORDER BY revenue DESC, units_sold DESC
			LIMIT ${limit};
		`;

		return rows.map(row => ({
			productId: row.product_id,
			name: row.name,
			unitsSold: row.units_sold,
			revenue: row.revenue
		}));
	}

	async getTopCategories({
		establishmentId,
		from,
		to,
		limit
	}: DashboardTopNInput): Promise<DashboardTopCategoryRow[]> {
		const establishmentFilter = buildEstablishmentFilter(establishmentId);

		const rows = await prisma.$queryRaw<
			{
				category_id: string;
				name: string;
				units_sold: number;
				revenue: number;
			}[]
		>`
			WITH scoped_orders AS (
				SELECT o.id
				FROM orders o
				WHERE o.deleted_at IS NULL
					AND o.created_at >= ${from}
					AND o.created_at <  ${to}
					${establishmentFilter}
			),
			latest_status AS (
				SELECT DISTINCT ON (order_id)
					order_id,
					value AS status
				FROM order_statuses
				WHERE order_id IN (SELECT id FROM scoped_orders)
				ORDER BY order_id, created_at DESC
			)
			SELECT
				pc.id AS category_id,
				pc.name AS name,
				SUM(oi.quantity)::int AS units_sold,
				SUM(oi.product_price * oi.quantity)::int AS revenue
			FROM order_items oi
			JOIN scoped_orders so ON so.id = oi.order_id
			JOIN latest_status ls ON ls.order_id = oi.order_id
			JOIN products p ON p.id = oi.product_id
			JOIN product_categories pc ON pc.id = p.category_id
			WHERE ls.status <> 'CANCELLED'
			GROUP BY pc.id, pc.name
			ORDER BY revenue DESC, units_sold DESC
			LIMIT ${limit};
		`;

		return rows.map(row => ({
			categoryId: row.category_id,
			name: row.name,
			unitsSold: row.units_sold,
			revenue: row.revenue
		}));
	}

	async getTopCustomers({
		establishmentId,
		from,
		to,
		limit
	}: DashboardTopNInput & {
		establishmentId: string;
	}): Promise<DashboardTopCustomerRow[]> {
		const rows = await prisma.$queryRaw<
			{
				user_id: string;
				name: string;
				orders: number;
				spent: number;
			}[]
		>`
			WITH scoped_orders AS (
				SELECT
					o.id,
					o.user_id,
					o.subtotal,
					o.shipping_fee,
					COALESCE(oc.discount_value, 0) AS discount_value
				FROM orders o
				LEFT JOIN order_coupons oc ON oc.order_id = o.id
				WHERE o.deleted_at IS NULL
					AND o.created_at >= ${from}
					AND o.created_at <  ${to}
					AND o.establishment_id = ${establishmentId}
			),
			latest_status AS (
				SELECT DISTINCT ON (order_id)
					order_id,
					value AS status
				FROM order_statuses
				WHERE order_id IN (SELECT id FROM scoped_orders)
				ORDER BY order_id, created_at DESC
			)
			SELECT
				so.user_id AS user_id,
				u.name AS name,
				COUNT(*)::int AS orders,
				SUM(so.subtotal + so.shipping_fee - so.discount_value)::int AS spent
			FROM scoped_orders so
			JOIN latest_status ls ON ls.order_id = so.id
			JOIN users u ON u.id = so.user_id
			WHERE ls.status <> 'CANCELLED'
			GROUP BY so.user_id, u.name
			ORDER BY spent DESC, orders DESC
			LIMIT ${limit};
		`;

		return rows.map(row => ({
			userId: row.user_id,
			name: row.name,
			orders: row.orders,
			spent: row.spent
		}));
	}

	async getCouponsUsage({
		establishmentId,
		from,
		to,
		limit
	}: DashboardTopNInput): Promise<DashboardCouponUsageRow[]> {
		const establishmentFilter = buildEstablishmentFilter(establishmentId);

		const rows = await prisma.$queryRaw<
			{
				code: string;
				orders_with_coupon: number;
				discount_total: number;
			}[]
		>`
			WITH scoped_orders AS (
				SELECT o.id
				FROM orders o
				WHERE o.deleted_at IS NULL
					AND o.created_at >= ${from}
					AND o.created_at <  ${to}
					${establishmentFilter}
			),
			latest_status AS (
				SELECT DISTINCT ON (order_id)
					order_id,
					value AS status
				FROM order_statuses
				WHERE order_id IN (SELECT id FROM scoped_orders)
				ORDER BY order_id, created_at DESC
			)
			SELECT
				oc.code AS code,
				COUNT(*)::int AS orders_with_coupon,
				SUM(oc.discount_value)::int AS discount_total
			FROM order_coupons oc
			JOIN scoped_orders so ON so.id = oc.order_id
			JOIN latest_status ls ON ls.order_id = oc.order_id
			WHERE ls.status <> 'CANCELLED'
			GROUP BY oc.code
			ORDER BY discount_total DESC, orders_with_coupon DESC
			LIMIT ${limit};
		`;

		return rows.map(row => ({
			code: row.code,
			ordersWithCoupon: row.orders_with_coupon,
			discountTotal: row.discount_total
		}));
	}

	async getTopEstablishments({
		from,
		to,
		limit
	}: Omit<DashboardTopNInput, "establishmentId">): Promise<
		DashboardTopEstablishmentRow[]
	> {
		const rows = await prisma.$queryRaw<
			{
				establishment_id: string;
				name: string;
				orders: number;
				revenue: number;
			}[]
		>`
			WITH scoped_orders AS (
				SELECT
					o.id,
					o.establishment_id,
					o.subtotal,
					o.shipping_fee,
					COALESCE(oc.discount_value, 0) AS discount_value
				FROM orders o
				LEFT JOIN order_coupons oc ON oc.order_id = o.id
				WHERE o.deleted_at IS NULL
					AND o.created_at >= ${from}
					AND o.created_at <  ${to}
			),
			latest_status AS (
				SELECT DISTINCT ON (order_id)
					order_id,
					value AS status
				FROM order_statuses
				WHERE order_id IN (SELECT id FROM scoped_orders)
				ORDER BY order_id, created_at DESC
			)
			SELECT
				e.id AS establishment_id,
				e.name AS name,
				COUNT(*)::int AS orders,
				SUM(so.subtotal + so.shipping_fee - so.discount_value)::int AS revenue
			FROM scoped_orders so
			JOIN latest_status ls ON ls.order_id = so.id
			JOIN establishments e ON e.id = so.establishment_id
			WHERE ls.status <> 'CANCELLED'
			GROUP BY e.id, e.name
			ORDER BY revenue DESC, orders DESC
			LIMIT ${limit};
		`;

		return rows.map(row => ({
			establishmentId: row.establishment_id,
			name: row.name,
			orders: row.orders,
			revenue: row.revenue
		}));
	}

	async getEstablishmentsCount(): Promise<number> {
		return await prisma.establishment.count();
	}

	async getCustomersCount(): Promise<number> {
		return await prisma.user.count({
			where: {
				deleted_at: null,
				role: { name: RoleType.CUSTOMER }
			}
		});
	}
}
