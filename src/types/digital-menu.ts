import type { Prisma } from "@/generated/prisma/client.js";

export type GenerateDigitalMenuJob = {
  establishmentId: string;
};

export type DigitalMenuRenderSource = Prisma.EstablishmentGetPayload<{
  include: {
    address: {
      select: {
        address: true;
      };
    };
    resources: {
      select: {
        resource: true;
      };
    };
    categories: {
      include: {
        resources: {
          select: {
            resource: true;
          };
        };
        products: {
          include: {
            resources: {
              select: {
                resource: true;
              };
            };
          };
        };
      };
    };
  };
}>;

export type DigitalMenuProduct = {
  name: string;
  description: string;
  priceLabel: string;
  originalPriceLabel: string | null;
  isPerWeight: boolean;
  imageUrl: string | null;
};

export type DigitalMenuCategory = {
  name: string;
  bannerUrl: string | null;
  products: DigitalMenuProduct[];
};

export type DigitalMenuColors = {
  primary: string;
  secondary: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
};

export type DigitalMenuRenderData = {
  establishment: {
    name: string;
    description: string;
    addressLine: string | null;
    phone: string | null;
    logoUrl: string | null;
    bannerUrl: string | null;
  };
  colors: DigitalMenuColors;
  categories: DigitalMenuCategory[];
  generatedAtLabel: string;
};
