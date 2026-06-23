import { RecommendationSource } from "@/generated/prisma/client.js";
import type { IProductRecommendationRepository } from "@/interfaces/repositories/product-recommendation-repository.js";
import prisma from "@/lib/prisma.js";
import type { EstablishmentID } from "@/types/establishment.js";
import type {
	CoOccurrenceRow,
	ProductRecommendationWithProducts
} from "@/types/recommendation.js";

export class ProductRecommendationPrismaRepository
	implements IProductRecommendationRepository
{
	async listManualByEstablishment(
		establishmentId: EstablishmentID
	): Promise<ProductRecommendationWithProducts[]> {
		return await prisma.productRecommendation.findMany({
			where: {
				establishment_id: establishmentId,
				source: RecommendationSource.MANUAL
			},
			include: {
				product: { select: { id: true, name: true } },
				recommended_product: { select: { id: true, name: true } }
			},
			orderBy: { created_at: "desc" }
		});
	}

	async createManual({
		establishmentId,
		productId,
		recommendedProductId
	}: {
		establishmentId: EstablishmentID;
		productId: string;
		recommendedProductId: string;
	}): Promise<void> {
		await prisma.productRecommendation.upsert({
			where: {
				product_id_recommended_product_id: {
					product_id: productId,
					recommended_product_id: recommendedProductId
				}
			},
			create: {
				establishment_id: establishmentId,
				product_id: productId,
				recommended_product_id: recommendedProductId,
				source: RecommendationSource.MANUAL,
				score: 0
			},
			update: { source: RecommendationSource.MANUAL }
		});
	}

	async deleteById(
		id: string,
		establishmentId: EstablishmentID
	): Promise<void> {
		await prisma.productRecommendation.deleteMany({
			where: {
				id,
				establishment_id: establishmentId,
				source: RecommendationSource.MANUAL
			}
		});
	}

	async computeCoOccurrences(): Promise<CoOccurrenceRow[]> {
		return await prisma.$queryRaw<CoOccurrenceRow[]>`
			SELECT o.establishment_id AS establishment_id,
			       oi1.product_id AS product_id,
			       oi2.product_id AS recommended_product_id,
			       COUNT(*)::int AS score
			FROM order_items oi1
			JOIN order_items oi2
			  ON oi2.order_id = oi1.order_id AND oi2.product_id <> oi1.product_id
			JOIN orders o ON o.id = oi1.order_id
			WHERE o.deleted_at IS NULL
			GROUP BY o.establishment_id, oi1.product_id, oi2.product_id
		`;
	}

	async replaceAutoRecommendations(rows: CoOccurrenceRow[]): Promise<void> {
		await prisma.$transaction([
			prisma.productRecommendation.deleteMany({
				where: { source: RecommendationSource.AUTO }
			}),
			prisma.productRecommendation.createMany({
				data: rows.map(row => ({
					establishment_id: row.establishment_id,
					product_id: row.product_id,
					recommended_product_id: row.recommended_product_id,
					source: RecommendationSource.AUTO,
					score: row.score
				})),
				skipDuplicates: true
			})
		]);
	}
}
