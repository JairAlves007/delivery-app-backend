import ExcelJS from "exceljs";

import Constants from "@/helpers/constants.js";
import {
  getDeliveryTypeLabel,
  getPaymentMethodLabel,
  getStatusLabel,
} from "@/helpers/order.js";
import { formatPhoneForDisplay } from "@/helpers/phone.js";
import type {
  DashboardExportResult,
  DashboardExportServiceInput,
  DashboardGranularity,
  DashboardResponse,
} from "@/types/dashboard.js";

import type { GetDashboardService } from "./get-dashboard-service.js";

type ExportSection = {
  title: string;
  headers: string[];
  rows: (string | number)[][];
  moneyColumns: number[];
};

const formatMoneyBR = (value: number): string =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatDateBR = (isoDate: string): string =>
  new Date(isoDate).toLocaleDateString("pt-BR", {
    timeZone: Constants.DASHBOARD_TIMEZONE,
  });

const formatBucketLabel = (
  bucket: string,
  granularity: DashboardGranularity,
): string => {
  const [year, month, day] = bucket.split("-");
  if (granularity === "month") return `${month}/${year}`;

  const label = `${day}/${month}/${year}`;
  return granularity === "week" ? `Semana de ${label}` : label;
};

const buildSections = (data: DashboardResponse): ExportSection[] => [
  {
    title: "Resumo",
    headers: ["Métrica", "Valor"],
    rows: [
      ["Período", `${formatDateBR(data.range.from)} a ${formatDateBR(data.range.to)}`],
      ["Total de pedidos", data.summary.totalOrders],
      ["Pedidos pagos", data.summary.paidOrders],
      ["Pedidos cancelados", data.summary.cancelledOrders],
      ["Receita bruta", formatMoneyBR(data.summary.grossRevenue)],
      ["Descontos", formatMoneyBR(data.summary.discountsTotal)],
      ["Frete", formatMoneyBR(data.summary.shippingTotal)],
      ["Receita líquida", formatMoneyBR(data.summary.netRevenue)],
      ["Ticket médio", formatMoneyBR(data.summary.averageOrderValue)],
      ["Clientes únicos", data.summary.distinctCustomers],
    ],
    moneyColumns: [],
  },
  {
    title: "Pedidos por período",
    headers: ["Período", "Pedidos", "Receita"],
    rows: data.ordersOverTime.map((row) => [
      formatBucketLabel(row.bucket, data.range.granularity),
      row.orders,
      row.revenue,
    ]),
    moneyColumns: [2],
  },
  {
    title: "Pedidos por status",
    headers: ["Status", "Quantidade", "Receita"],
    rows: data.ordersByStatus.map((row) => [
      getStatusLabel(row.status),
      row.count,
      row.revenue,
    ]),
    moneyColumns: [2],
  },
  {
    title: "Pedidos por pagamento",
    headers: ["Forma de pagamento", "Quantidade", "Receita"],
    rows: data.ordersByPaymentMethod.map((row) => [
      getPaymentMethodLabel(row.method),
      row.count,
      row.revenue,
    ]),
    moneyColumns: [2],
  },
  {
    title: "Pedidos por entrega",
    headers: ["Tipo de entrega", "Quantidade", "Receita"],
    rows: data.ordersByDeliveryType.map((row) => [
      getDeliveryTypeLabel(row.type),
      row.count,
      row.revenue,
    ]),
    moneyColumns: [2],
  },
  {
    title: "Produtos mais vendidos",
    headers: ["Produto", "Unidades vendidas", "Receita"],
    rows: data.topProducts.map((row) => [row.name, row.unitsSold, row.revenue]),
    moneyColumns: [2],
  },
  {
    title: "Categorias mais vendidas",
    headers: ["Categoria", "Unidades vendidas", "Receita"],
    rows: data.topCategories.map((row) => [
      row.name,
      row.unitsSold,
      row.revenue,
    ]),
    moneyColumns: [2],
  },
  {
    title: "Melhores clientes",
    headers: ["Nome", "Telefone", "Pedidos", "Total gasto"],
    rows: data.topCustomers.map((row) => [
      row.name,
      formatPhoneForDisplay(row.phone),
      row.orders,
      row.spent,
    ]),
    moneyColumns: [3],
  },
  {
    title: "Cupons utilizados",
    headers: ["Código", "Pedidos com cupom", "Total de descontos"],
    rows: data.couponsUsage.map((row) => [
      row.code,
      row.ordersWithCoupon,
      row.discountTotal,
    ]),
    moneyColumns: [2],
  },
];

const escapeCsvField = (field: string): string =>
  /[";\n\r]/.test(field) ? `"${field.replace(/"/g, '""')}"` : field;

const formatCsvCell = (params: {
  cell: string | number;
  columnIndex: number;
  moneyColumns: number[];
}): string => {
  const { cell, columnIndex, moneyColumns } = params;

  if (typeof cell !== "number") return escapeCsvField(cell);
  if (moneyColumns.includes(columnIndex))
    return cell.toFixed(2).replace(".", ",");

  return String(cell);
};

const buildCsv = (sections: ExportSection[]): Buffer => {
  const lines: string[] = [];

  for (const section of sections) {
    lines.push(escapeCsvField(section.title));
    lines.push(section.headers.map(escapeCsvField).join(";"));

    for (const row of section.rows) {
      lines.push(
        row
          .map((cell, columnIndex) =>
            formatCsvCell({
              cell,
              columnIndex,
              moneyColumns: section.moneyColumns,
            }),
          )
          .join(";"),
      );
    }

    lines.push("");
  }

  return Buffer.from(`${"\uFEFF"}${lines.join("\r\n")}`, "utf8");
};

const buildXlsx = async (sections: ExportSection[]): Promise<Buffer> => {
  const workbook = new ExcelJS.Workbook();

  for (const section of sections) {
    const sheet = workbook.addWorksheet(section.title, {
      views: [{ state: "frozen", ySplit: 1 }],
    });

    const headerRow = sheet.addRow(section.headers);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1F2937" },
    };

    for (const row of section.rows) sheet.addRow(row);

    section.headers.forEach((header, columnIndex) => {
      const column = sheet.getColumn(columnIndex + 1);
      column.width = Math.max(20, header.length + 6);
      if (section.moneyColumns.includes(columnIndex))
        column.numFmt = '"R$" #,##0.00';
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer as ArrayBuffer);
};

export class ExportDashboardService {
  private getDashboardService: GetDashboardService;

  constructor(getDashboardService: GetDashboardService) {
    this.getDashboardService = getDashboardService;
  }

  async handle(
    input: DashboardExportServiceInput,
  ): Promise<DashboardExportResult> {
    const { format, ...dashboardInput } = input;

    const data = await this.getDashboardService.handle(dashboardInput);
    const sections = buildSections(data);

    const buffer =
      format === "xlsx" ? await buildXlsx(sections) : buildCsv(sections);

    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: Constants.DASHBOARD_TIMEZONE,
    });

    return {
      buffer,
      fileName: `relatorio-dashboard-${today}.${format}`,
      mimeType: Constants.DASHBOARD_EXPORT_MIME_TYPES[format],
    };
  }
}
