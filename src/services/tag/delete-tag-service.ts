import { TagNotFound } from "@/errors/tag/not-found-error.js";
import type { ITagRepository } from "@/interfaces/repositories/tag-repository.js";

type DeleteTagServiceRequest = {
	id: number;
	establishmentId: string;
};

export class DeleteTagService {
	private tagRepository: ITagRepository;

	constructor(tagRepository: ITagRepository) {
		this.tagRepository = tagRepository;
	}

	async handle({ id, establishmentId }: DeleteTagServiceRequest) {
		const tag = await this.tagRepository.findById({
			id,
			filterParams: { establishment_id: establishmentId }
		});

		if (!tag) throw new TagNotFound();

		await this.tagRepository.delete({
			id,
			force: false,
			filterParams: { establishment_id: establishmentId }
		});
	}
}
