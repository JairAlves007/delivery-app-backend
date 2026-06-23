import type { EstablishmentID } from "@/types/establishment.js";
import type {
	CoOccurrenceRow,
	ProductRecommendationWithProducts
} from "@/types/recommendation.js";

export interface IProductRecommendationRepository {
	listManualByEstablishment(
		establishmentId: EstablishmentID
	): Promise<ProductRecommendationWithProducts[]>;
	createManual(params: {
		establishmentId: EstablishmentID;
		productId: string;
		recommendedProductId: string;
	}): Promise<void>;
	deleteById(id: string, establishmentId: EstablishmentID): Promise<void>;
	computeCoOccurrences(): Promise<CoOccurrenceRow[]>;
	replaceAutoRecommendations(rows: CoOccurrenceRow[]): Promise<void>;
}
