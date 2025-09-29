import type { ForObjectResourceType, ResourceType } from "@prisma/client";

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
	forResource: ForObjectResourceType;
	fileMimeType: FileMimeType;
	resourceType: ResourceType;
};
