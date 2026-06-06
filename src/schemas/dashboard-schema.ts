import z from "zod";

const DASHBOARD_MAX_RANGE_DAYS = 366;
const DAY_MS = 24 * 60 * 60 * 1000;

export const dashboardGranularitySchema = z.enum(
  ["day", "week", "month"],
  "Granularidade inválida",
);

export const dashboardExportFormatSchema = z.enum(
  ["xlsx", "csv"],
  "Formato inválido",
);

const dashboardQueryFields = {
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  granularity: dashboardGranularitySchema.default("day"),
};

const dashboardRangeRefinement = (
  data: { from?: Date; to?: Date },
  ctx: z.core.$RefinementCtx,
) => {
  if (data.from && data.to && data.from > data.to) {
    ctx.addIssue({
      path: ["from"],
      code: "custom",
      message: "A data inicial deve ser menor ou igual à data final",
    });
  }

  if (data.from && data.to) {
    const diff = data.to.getTime() - data.from.getTime();
    if (diff > DASHBOARD_MAX_RANGE_DAYS * DAY_MS) {
      ctx.addIssue({
        path: ["to"],
        code: "custom",
        message: `O intervalo máximo permitido é de ${DASHBOARD_MAX_RANGE_DAYS} dias`,
      });
    }
  }
};

export const dashboardQuerySchema = z
  .object(dashboardQueryFields)
  .superRefine(dashboardRangeRefinement);

export const dashboardExportQuerySchema = z
  .object({
    ...dashboardQueryFields,
    format: dashboardExportFormatSchema.default("xlsx"),
  })
  .superRefine(dashboardRangeRefinement);
