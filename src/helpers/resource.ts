import { fileMimeTypeValues, type FileMimeType } from "@/types/resource.ts";
import {
	FileFormatType,
	ForObjectResourceType,
	Prisma,
	ResourceType
} from "@prisma/client";

export const getResourcePath = (
	forResource: ForObjectResourceType,
	resourceType: ResourceType
): string => {
	return `${forResource.toLowerCase()}/${resourceType.toLowerCase()}`;
};

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

export const attachObjectResource = (
	forResource: ForObjectResourceType,
	objectId: string
): Partial<Prisma.ResourceCreateInput> => {
	switch (forResource) {
		case ForObjectResourceType.ESTABLISHMENT:
			return {
				establishmentResources: {
					create: {
						establishment_id: objectId
					}
				}
			};
		case ForObjectResourceType.PRODUCT:
			return {
				productResources: {
					create: {
						product_id: objectId
					}
				}
			};
		case ForObjectResourceType.CATEGORY:
			return {
				productCategoryResources: {
					create: {
						category_id: objectId
					}
				}
			};
		default:
			return {};
	}
};
