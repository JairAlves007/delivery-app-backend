import type {
  DashboardBucketRow,
  DashboardCouponUsageRow,
  DashboardDeliveryTypeRow,
  DashboardOrdersOverTimeInput,
  DashboardPaymentMethodRow,
  DashboardRepositoryInput,
  DashboardStatusRow,
  DashboardSummaryRow,
  DashboardTopCategoryRow,
  DashboardTopCustomerRow,
  DashboardTopNInput,
  DashboardTopProductRow,
} from "@/types/dashboard.js";

export interface IDashboardRepository {
  getSummary(input: DashboardRepositoryInput): Promise<DashboardSummaryRow>;
  getOrdersOverTime(
    input: DashboardOrdersOverTimeInput,
  ): Promise<DashboardBucketRow[]>;
  getOrdersByStatus(
    input: DashboardRepositoryInput,
  ): Promise<DashboardStatusRow[]>;
  getOrdersByPaymentMethod(
    input: DashboardRepositoryInput,
  ): Promise<DashboardPaymentMethodRow[]>;
  getOrdersByDeliveryType(
    input: DashboardRepositoryInput,
  ): Promise<DashboardDeliveryTypeRow[]>;
  getTopProducts(input: DashboardTopNInput): Promise<DashboardTopProductRow[]>;
  getTopCategories(
    input: DashboardTopNInput,
  ): Promise<DashboardTopCategoryRow[]>;
  getTopCustomers(
    input: DashboardTopNInput,
  ): Promise<DashboardTopCustomerRow[]>;
  getCouponsUsage(
    input: DashboardTopNInput,
  ): Promise<DashboardCouponUsageRow[]>;
}
