import { fileMimeTypeValues, type FileMimeType } from "@/types/resource.ts";
import {
	FileFormatType,
	ForObjectResourceType,
	ResourceType
} from "@prisma/client";

export function getResourcePath(
	forResource: ForObjectResourceType,
	resourceType: ResourceType
): string {
	return `${forResource.toLowerCase()}/${resourceType.toLowerCase()}`;
}

export function mapMimeTypeToFileFormat(
	mimeType: FileMimeType
): FileFormatType {
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
}
