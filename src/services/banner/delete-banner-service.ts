import type { IBannerRepository } from "@/interfaces/repositories/banner-repository.ts";

export class DeleteBannerService {
	private bannerRepository: IBannerRepository;

	constructor(bannerRepository: IBannerRepository) {
		this.bannerRepository = bannerRepository;
	}

	async handle(id: number) {
		return await this.bannerRepository.delete(id, false);
	}
}
