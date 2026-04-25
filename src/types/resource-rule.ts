import type {
  ForObjectResourceType,
  Prisma,
} from "@/generated/prisma/client.js";

import type { ResourceIntent } from "./resource.js";

export type ValidateResourceRuleParams = {
  resourceIntent: ResourceIntent;
};

export type UploadResourceRulesParams = {
  forObject: ForObjectResourceType;
};

export type ResourceRuleFromRepository = Prisma.ResourceRuleGetPayload<{
  include: {
    availableFormats: true;
  };
}>;
