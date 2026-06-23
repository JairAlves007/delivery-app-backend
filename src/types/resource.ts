import type {
  ForObjectResourceType,
  Prisma,
  Resource,
  ResourceType,
} from "@/generated/prisma/client.js";

export const fileMimeTypeValues = {
  PNG: "image/png",
  JPG: "image/jpg",
  JPEG: "image/jpeg",
} as const;

export type FileMimeType =
  (typeof fileMimeTypeValues)[keyof typeof fileMimeTypeValues];

export type ResourceIntent = {
  width: number;
  height: number;
  for: ForObjectResourceType;
  type: ResourceType;
  mimeType: FileMimeType;
};

export type ResourceInfo = {
  path: string;
  attachData: Partial<Prisma.ResourceCreateInput>;
};

export type ResourceItem = Partial<
  Record<ResourceType, { id: string; path: string; fileKey: string }>
>;

export type ObjectResources = {
  resource: Resource;
};

export type DeleteResourceJobPayload = {
  kind: "delete-resource";
  resourceId: string;
  bucketKey: string;
  forResources: ForObjectResourceType[];
};

export type DeleteR2ObjectJobPayload = {
  kind: "delete-r2-object";
  bucketKey: string;
};

export type ResourceJobPayload =
  | DeleteResourceJobPayload
  | DeleteR2ObjectJobPayload;

export type ResourceWithJoinCounts = Resource & {
  _count: {
    productResources: number;
    establishmentResources: number;
    productCategoryResources: number;
    bannerResources: number;
    comboResources: number;
  };
};
