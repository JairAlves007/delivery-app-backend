import type {
	ForObjectResourceType,
	Prisma,
	Resource,
	ResourceType
} from "@/generated/prisma/client.js";

export const fileMimeTypeValues = {
	PNG: "image/png",
	JPG: "image/jpg",
	JPEG: "image/jpeg"
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
