export const SCOPE = {
  admin: "scope:admin",
  customer: "scope:customer",
  shared: "scope:shared",
} as const;

export const adminTags = (feature: string) => [feature, SCOPE.admin];
export const customerTags = (feature: string) => [feature, SCOPE.customer];
export const sharedTags = (feature: string) => [feature, SCOPE.shared];
