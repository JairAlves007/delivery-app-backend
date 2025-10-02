import { makeCache } from "@/factories/services/cache/make-cache.ts";
import {
	fileMimeTypeValues,
	type ObjectResources,
	type ResourceItem,
	type FileMimeType,
	type ResourceInfo,
	type ResourceIntent
} from "@/types/resource.ts";
import { FileFormatType, ForObjectResourceType } from "@prisma/client";

export const mapMimeTypeToFileFormat = (
	mimeType: FileMimeType
): FileFormatType => {
	switch (mimeType) {
		case fileMimeTypeValues.PNG:
			return FileFormatType.PNG;
		case fileMimeTypeValues.JPG:
			return FileFormatType.JPG;
		case fileMimeTypeValues.JPEG:
			return FileFormatType.JPEG;
		default:
			throw new Error(`MIME Type '${mimeType}' não suportado para conversão.`);
	}
};

export const mapObjectResourcesList = (
	resources: ObjectResources[]
): ResourceItem => {
	if (!resources) return {};

	return resources.reduce((acc: ResourceItem, currentItem: ObjectResources) => {
		const {
			resource: { id, type, path, file_key }
		} = currentItem;

		acc[type.toLowerCase()] = {
			id,
			path: `${path}/${file_key}`
		};

		return acc;
	}, {});
};

export const getInfoByForResource = (
	{ for: forResource, ...resource }: ResourceIntent,
	objectId: string
): ResourceInfo => {
	const path = `${forResource.toLowerCase()}/${resource.type.toLowerCase()}`;

	switch (forResource) {
		case ForObjectResourceType.ESTABLISHMENT:
			return {
				path,
				attachData: {
					establishmentResources: {
						create: {
							establishment_id: objectId
						}
					}
				}
			};
		case ForObjectResourceType.PRODUCT:
			return {
				path,
				attachData: {
					productResources: {
						create: {
							product_id: objectId
						}
					}
				}
			};
		case ForObjectResourceType.CATEGORY:
			return {
				path,
				attachData: {
					productCategoryResources: {
						create: {
							category_id: objectId
						}
					}
				}
			};
		default:
			return {
				path,
				attachData: {}
			};
	}
};

export const forgetCacheByForResource = async (
	forResource: ForObjectResourceType
): Promise<void> => {
	if (!forResource) return;

	const cache = makeCache();
	let key = "";

	switch (forResource) {
		case ForObjectResourceType.ESTABLISHMENT:
			key = cache.keys.establishments;
			break;
		case ForObjectResourceType.PRODUCT:
			key = cache.keys.products;
			break;
		case ForObjectResourceType.CATEGORY:
			key = cache.keys.productCategories;
			break;
	}

	await cache.forgetKeysContaining(key);
};
