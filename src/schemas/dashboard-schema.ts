import z from "zod";

const DASHBOARD_MAX_RANGE_DAYS = 366;
const DAY_MS = 24 * 60 * 60 * 1000;

export const dashboardGranularitySchema = z.enum(
	["day", "week", "month"],
	"Granularidade inválida"
);

z.globalRegistry.add(dashboardGranularitySchema, { id: "DashboardGranularity" });

export const dashboardQuerySchema = z
	.object({
		from: z.coerce.date("Data inicial inválida").optional(),
		to: z.coerce.date("Data final inválida").optional(),
		granularity: dashboardGranularitySchema.default("day"),
		establishmentId: z
			.ulid("O id do estabelecimento deve ser um ULID válido")
			.optional()
	})
	.superRefine((data, ctx) => {
		if (data.from && data.to && data.from > data.to) {
			ctx.addIssue({
				path: ["from"],
				code: "custom",
				message: "A data inicial deve ser menor ou igual à data final"
			});
		}

		if (data.from && data.to) {
			const diff = data.to.getTime() - data.from.getTime();
			if (diff > DASHBOARD_MAX_RANGE_DAYS * DAY_MS) {
				ctx.addIssue({
					path: ["to"],
					code: "custom",
					message: `O intervalo máximo permitido é de ${DASHBOARD_MAX_RANGE_DAYS} dias`
				});
			}
		}
	});

z.globalRegistry.add(dashboardQuerySchema, { id: "DashboardQuery" });
